"""
Reset Password page (auth/reset-password) smoke tests.
"""
from playwright.sync_api import Page, expect

from tests.config import NORMAL_TIMEOUT


def test_reset_password_loads(page: Page, app_url: str):
    """Asserts the reset password page loads with heading, Verification Code, New Password, Confirm Password fields and Reset Password button."""
    page.goto(f"{app_url}/auth/reset-password?email=test@example.com", wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    expect(page.get_by_text("Create new password")).to_be_visible(timeout=NORMAL_TIMEOUT)
    expect(page.get_by_label("Verification Code")).to_be_visible(timeout=NORMAL_TIMEOUT)
    expect(page.get_by_label("New Password")).to_be_visible(timeout=NORMAL_TIMEOUT)
    expect(page.get_by_label("Confirm Password")).to_be_visible(timeout=NORMAL_TIMEOUT)
    expect(page.get_by_role("button", name="Reset Password")).to_be_visible(timeout=NORMAL_TIMEOUT)
