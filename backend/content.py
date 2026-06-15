import os
import time
import hmac
import hashlib
import base64
import json

from supabase import create_client

_client = None


def get_client():
    global _client
    if _client is None:
        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_KEY"]
        _client = create_client(url, key)
    return _client


def get_block(block_id, default=None):
    if not os.environ.get("SUPABASE_URL"):
        return default
    try:
        res = get_client().table("content_blocks").select("data").eq("id", block_id).execute()
    except Exception:
        return default
    if res.data:
        return res.data[0]["data"]
    return default


def set_block(block_id, data):
    get_client().table("content_blocks").upsert({"id": block_id, "data": data}).execute()


def list_blocks():
    res = get_client().table("content_blocks").select("id").execute()
    return [row["id"] for row in res.data]


# --- simple admin token (HMAC, no external deps) ---

TOKEN_TTL_SECONDS = 12 * 60 * 60


def _secret():
    return os.environ["ADMIN_TOKEN_SECRET"].encode()


def create_token():
    payload = json.dumps({"exp": int(time.time()) + TOKEN_TTL_SECONDS}).encode()
    payload_b64 = base64.urlsafe_b64encode(payload).rstrip(b"=")
    sig = hmac.new(_secret(), payload_b64, hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(sig).rstrip(b"=")
    return f"{payload_b64.decode()}.{sig_b64.decode()}"


def verify_token(token):
    try:
        payload_b64, sig_b64 = token.split(".")
        expected_sig = hmac.new(_secret(), payload_b64.encode(), hashlib.sha256).digest()
        expected_sig_b64 = base64.urlsafe_b64encode(expected_sig).rstrip(b"=").decode()
        if not hmac.compare_digest(sig_b64, expected_sig_b64):
            return False
        payload = json.loads(base64.urlsafe_b64decode(payload_b64 + "=="))
        return payload["exp"] > time.time()
    except Exception:
        return False
