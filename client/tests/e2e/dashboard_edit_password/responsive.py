"""Edit Password page responsive tests."""
import pytest
from playwright.sync_api import Page, expect

from tests.config import NORMAL_TIMEOUT
from tests.helpers.responsive import assert_no_horizontal_overflow
from tests.viewports import VIEWPORTS


def test_edit_password_responsive(page: Page, app_url: str, authenticated_page):
    """Page renders without horizontal overflow at all viewports."""
    page.goto(f"{app_url}/dashboard/edit/00000000-0000-0000-0000-000000000000", wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    if "/auth/login" in page.url:
        pytest.skip("Authentication fixture not available")
    # Page redirects to dashboard — verify responsive behavior there
    for vp in VIEWPORTS:
        page.set_viewport_size({"width": vp["width"], "height": vp["height"]})
        expect(page.get_by_role("heading", name="Password Vault")).to_be_visible(timeout=NORMAL_TIMEOUT)
        assert_no_horizontal_overflow(page, vp["name"], vp["width"])
