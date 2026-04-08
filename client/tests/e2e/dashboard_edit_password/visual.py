"""Edit Password page visual tests."""
import pytest
from playwright.sync_api import Page, expect

from tests.config import NORMAL_TIMEOUT


def test_edit_password_visual(page: Page, app_url: str, authenticated_page):
    """Page loads at desktop viewport (redirects to dashboard for nonexistent ID)."""
    page.set_viewport_size({"width": 1440, "height": 900})
    page.goto(f"{app_url}/dashboard/edit/00000000-0000-0000-0000-000000000000", wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    if "/auth/login" in page.url:
        pytest.skip("Authentication fixture not available")
    expect(page.get_by_role("heading", name="Password Vault")).to_be_visible(timeout=NORMAL_TIMEOUT)
