import json
import re
import logging
from openai import OpenAI
from django.conf import settings

logger = logging.getLogger(__name__)

FALLBACK_RESPONSE = {
    "status": "Deficit",
    "recommendation": "Manual Review Required",
    "rationale": "LLM advisory module timeout or parse failure.",
}

SYSTEM_PROMPT = (
    "You are a Senior Agricultural Credit Risk Advisor for Indonesian cooperatives. "
    "Analyze the monthly cashflow array and harvest month to produce a loan restructuring advisory. "
    "You must output ONLY a valid JSON object. Do not include markdown formatting, backticks, "
    "or conversational text. Use this exact schema:\n"
    '{"status": "string (Surplus|Marginal|Deficit)", '
    '"recommendation": "string (the repayment structure advice)", '
    '"rationale": "string (2-3 sentence explanation referencing the cashflow data)"}'
)


def _get_client():
    return OpenAI(
        api_key=settings.GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1",
    )


def _sanitize_llm_json(raw: str) -> dict:
    text = raw.strip()

    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    text = text.strip()

    first_brace = text.find("{")
    last_brace = text.rfind("}")

    if first_brace == -1 or last_brace == -1 or last_brace <= first_brace:
        raise json.JSONDecodeError("No JSON object found in LLM response", text, 0)

    json_str = text[first_brace : last_brace + 1]
    return json.loads(json_str)


def generate_loan_advisory(cashflow_array: list, harvest_month: int) -> dict:
    user_prompt = (
        f"Monthly cashflow projection (month 1 to {len(cashflow_array)}): "
        f"{json.dumps(cashflow_array)}\n"
        f"Harvest month: {harvest_month}\n"
        "Analyze the deficit pattern and recommend the optimal repayment structure."
    )

    try:
        client = _get_client()
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=512,
            timeout=15,
        )

        raw_content = response.choices[0].message.content
        parsed = _sanitize_llm_json(raw_content)

        required_keys = {"status", "recommendation", "rationale"}
        if not required_keys.issubset(parsed.keys()):
            logger.warning("LLM response missing required keys: %s", parsed.keys())
            return FALLBACK_RESPONSE

        return {
            "status": str(parsed["status"]),
            "recommendation": str(parsed["recommendation"]),
            "rationale": str(parsed["rationale"]),
        }

    except json.JSONDecodeError as e:
        logger.error("LLM JSON parse failure: %s | raw: %s", e, raw_content[:500])
        return FALLBACK_RESPONSE
    except Exception as e:
        logger.error("LLM advisory error: %s", e)
        return FALLBACK_RESPONSE
