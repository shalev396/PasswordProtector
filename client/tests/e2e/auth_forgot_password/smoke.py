"""
Forgot Password page (auth/forgot-password) smoke tests.
"""
from playwright.sync_api import Page, expect

from tests.config import NORMAL_TIMEOUT


def test_forgot_password_loads(page: Page, app_url: str):
    """Asserts the forgot password page loads with heading, Email field, Send Reset Link button, and Sign in link."""
    page.goto(f"{app_url}/auth/forgot-password", wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    expect(page.get_by_text("Reset your password")).to_be_visible(timeout=NORMAL_TIMEOUT)
    expect(page.get_by_label("Email")).to_be_visible(timeout=NORMAL_TIMEOUT)
    expect(page.get_by_role("button", name="Send Reset Link")).to_be_visible(timeout=NORMAL_TIMEOUT)
    expect(page.get_by_role("link", name="Sign in")).to_be_visible(timeout=NORMAL_TIMEOUT)
