"""Add Password page security tests."""
from playwright.sync_api import Page, expect

from tests.config import NORMAL_TIMEOUT


def test_protected_add_password_redirects_unauthenticated(page: Page, app_url: str):
    """Unauthenticated access to /dashboard/add redirects to login."""
    page.goto(f"{app_url}/dashboard/add", wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    expect(page).to_have_url(f"{app_url}/auth/login", timeout=NORMAL_TIMEOUT)
