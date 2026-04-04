"""Add Password page responsive tests."""
import pytest
from playwright.sync_api import Page, expect

from tests.config import NORMAL_TIMEOUT
from tests.helpers.responsive import assert_no_horizontal_overflow
from tests.viewports import VIEWPORTS


def test_add_password_responsive(page: Page, app_url: str, authenticated_page):
    """Page renders without horizontal overflow at all viewports."""
    # Navigate via SPA click to preserve master password Redux state
    page.get_by_role("button", name="Add Password", exact=False).first.click(timeout=NORMAL_TIMEOUT)
    page.wait_for_load_state("networkidle")
    for vp in VIEWPORTS:
        page.set_viewport_size({"width": vp["width"], "height": vp["height"]})
        expect(page.get_by_text("Add Password")).to_be_visible(timeout=NORMAL_TIMEOUT)
        assert_no_horizontal_overflow(page, vp["name"], vp["width"])
