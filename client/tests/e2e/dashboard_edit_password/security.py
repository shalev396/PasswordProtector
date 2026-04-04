"""Edit Password page security tests."""
from playwright.sync_api import Page, expect

from tests.config import NORMAL_TIMEOUT


def test_protected_edit_password_redirects_unauthenticated(page: Page, app_url: str):
    """Unauthenticated access to /dashboard/edit/:id redirects to login."""
    page.goto(f"{app_url}/dashboard/edit/test-id", wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    expect(page).to_have_url(f"{app_url}/auth/login", timeout=NORMAL_TIMEOUT)
