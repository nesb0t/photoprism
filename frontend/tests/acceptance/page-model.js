import { Selector, t } from "testcafe";
import { RequestLogger } from "testcafe";

const logger = RequestLogger(/http:\/\/localhost:2343\/api\/v1\/*/, {
  logResponseHeaders: true,
  logResponseBody: true,
});

export default class Page {
  constructor() {
    this.view = Selector("div.p-view-select", { timeout: 15000 });
    this.camera = Selector("div.p-camera-select", { timeout: 15000 });
    this.countries = Selector("div.p-countries-select", { timeout: 15000 });
    this.time = Selector("div.p-time-select", { timeout: 15000 });
    this.search1 = Selector("div.input-search input", { timeout: 15000 });
  }

  async setFilter(filter, option) {
    let filterSelector = "";

    switch (filter) {
      case "view":
        filterSelector = "div.p-view-select";
        break;
      case "camera":
        filterSelector = "div.p-camera-select";
        break;
      case "time":
        filterSelector = "div.p-time-select";
        break;
      case "countries":
        filterSelector = "div.p-countries-select";
        break;
      default:
        throw "unknown filter";
    }
    if (!(await Selector(filterSelector).visible)) {
      await t.click(Selector(".p-expand-search"));
    }
    await t.click(filterSelector, { timeout: 15000 });

    if (option) {
      await t.click(Selector('div[role="listitem"]').withText(option), { timeout: 15000 });
    } else {
      await t.click(Selector('div[role="listitem"]').nth(1), { timeout: 15000 });
    }
  }

  async search(term) {
    await t.typeText(this.search1, term, { replace: true }).pressKey("enter");
  }

  async openNav() {
    if (await Selector("button.nav-show").exists) {
      await t.click(Selector("button.nav-show"));
    } else if (await Selector("div.nav-expand").exists) {
      await t.click(Selector("div.nav-expand i"));
    }
  }

  async selectFromUID(uid) {
    await t
      .hover(Selector("a").withAttribute("data-uid", uid))
      .click(Selector(`.uid-${uid} .input-select`));
  }

  async selectPhotoFromUID(uid) {
    await t
      .hover(Selector("div").withAttribute("data-uid", uid))
      .click(Selector(`.uid-${uid} .input-select`));
  }

  async selectFromUIDInFullscreen(uid) {
    await t.hover(Selector("div").withAttribute("data-uid", uid));
    if (await Selector(`.uid-${uid} .action-fullscreen`).exists) {
      await t.click(Selector(`.uid-${uid} .action-fullscreen`));
    } else {
      await t.click(Selector("div").withAttribute("data-uid", uid));
    }
    await t
      .expect(Selector("#p-photo-viewer").visible)
      .ok()
      .click(Selector('button[title="Select"]'))
      .click(Selector(".action-close", { timeout: 4000 }));
  }

  async toggleSelectNthPhoto(nPhoto) {
    await t
      .hover(Selector(".is-photo.type-image", { timeout: 4000 }).nth(nPhoto))
      .click(Selector(".is-photo.type-image .input-select").nth(nPhoto));
  }

  async toggleLike(uid) {
    await t.click(Selector(`.uid-${uid} .input-favorite`));
  }

  async archiveSelected() {
    if (!(await Selector("#t-clipboard button.action-archive").visible)) {
      await t.click(Selector("button.action-menu", { timeout: 5000 }));
    }
    if (t.browser.platform === "mobile") {
      if (!(await Selector("#t-clipboard button.action-archive").visible)) {
        await t.click(Selector("button.action-menu", { timeout: 5000 }));
        if (!(await Selector("#t-clipboard button.action-archive").visible)) {
          await t.click(Selector("button.action-menu", { timeout: 5000 }));
        }
        if (!(await Selector("#t-clipboard button.action-archive").visible)) {
          await t.click(Selector("button.action-menu", { timeout: 5000 }));
        }
      }
    }
    await t.click(Selector("#t-clipboard button.action-archive", { timeout: 5000 }));
  }

  async privateSelected() {
    await t.click(Selector("button.action-menu", { timeout: 5000 }));
    if (!(await Selector("button.action-private").visible)) {
      await t.click(Selector("button.action-menu", { timeout: 5000 }));
      if (!(await Selector("button.action-private").visible)) {
        await t.click(Selector("button.action-menu", { timeout: 5000 }));
      }
      if (!(await Selector("button.action-private").visible)) {
        await t.click(Selector("button.action-menu", { timeout: 5000 }));
      }
    }
    await t.click(Selector("button.action-private", { timeout: 5000 }));
  }

  async restoreSelected() {
    await t.click(Selector("button.action-menu")).click(Selector("button.action-restore"));
  }

  async editSelected() {
    if (await Selector("button.action-edit").visible) {
      await t.click(Selector("button.action-edit"));
    } else if (await Selector("button.action-menu").exists) {
      await t.click(Selector("button.action-menu")).click(Selector("button.action-edit"));
    }
  }

  async deleteSelected() {
    await t
      .click(Selector("button.action-menu"))
      .click(Selector("button.action-delete"))
      .click(Selector("button.action-confirm"));
  }

  async removeSelected() {
    await t.click(Selector("button.action-menu")).click(Selector("button.action-remove"));
  }

  async addSelectedToAlbum(name, type) {
    await t
      .click(Selector("button.action-menu"))
      .click(Selector("button.action-" + type))
      .typeText(Selector(".input-album input"), name, { replace: true })
      .pressKey("enter");
    if (await Selector('div[role="listitem"]').withText(name).visible) {
      await t.click(Selector('div[role="listitem"]').withText(name));
    }
    await t.click(Selector("button.action-confirm"));
  }

  async turnSwitchOff(type) {
    await t
      .click("#tab-info")
      .expect(
        Selector(".input-" + type + " input", { timeout: 8000 }).hasAttribute(
          "aria-checked",
          "true"
        )
      )
      .ok()
      .click(Selector(".input-" + type + " input"))
      .expect(
        Selector(".input-" + type + " input", { timeout: 8000 }).hasAttribute(
          "aria-checked",
          "false"
        )
      )
      .ok();
  }

  async turnSwitchOn(type) {
    await t
      .click("#tab-info")
      .expect(
        Selector(".input-" + type + " input", { timeout: 8000 }).hasAttribute(
          "aria-checked",
          "false"
        )
      )
      .ok()
      .click(Selector(".input-" + type + " input"))
      .expect(
        Selector(".input-" + type + " input", { timeout: 8000 }).hasAttribute(
          "aria-checked",
          "true"
        )
      )
      .ok();
  }

  async clearSelection() {
    if (await Selector(".action-clear").visible) {
      await t.click(Selector(".action-clear"));
    } else {
      await t.click(Selector(".action-menu")).click(Selector(".action-clear"));
    }
  }

  async login(password) {
    await t.typeText(Selector('input[type="password"]'), password).pressKey("enter");
  }

  async logout() {
    await t.click(Selector("div.nav-logout"));
  }

  async testCreateEditDeleteSharingLink(type) {
    await this.openNav();
    if (type === "states") {
      await t.click(Selector(".nav-places + div"));
    }
    await t.click(Selector(".nav-" + type));
    const FirstAlbum = await Selector("a.is-album").nth(0).getAttribute("data-uid");
    await this.selectFromUID(FirstAlbum);
    const clipboardCount = await Selector("span.count-clipboard");
    await t
      .expect(clipboardCount.textContent)
      .eql("1")
      .click(Selector("button.action-menu"))
      .click(Selector("button.action-share"))
      .click(Selector("div.v-expansion-panel__header__icon").nth(0));
    const InitialUrl = await Selector(".action-url").innerText;
    const InitialSecret = await Selector(".input-secret input").value;
    const InitialExpire = await Selector("div.v-select__selections").innerText;
    await t
      .expect(InitialUrl)
      .notContains("secretfortesting")
      .expect(InitialExpire)
      .contains("Never")
      .typeText(Selector(".input-secret input"), "secretForTesting", { replace: true })
      .click(Selector(".input-expires input"))
      .click(Selector("div").withText("After 1 day").parent('div[role="listitem"]'))
      .click(Selector("button.action-save"))
      .click(Selector("button.action-close"));
    await this.clearSelection();
    await t
      .click(Selector("a.is-album").withAttribute("data-uid", FirstAlbum))
      .click(Selector("button.action-share"))
      .click(Selector("div.v-expansion-panel__header__icon").nth(0));
    const UrlAfterChange = await Selector(".action-url").innerText;
    const ExpireAfterChange = await Selector("div.v-select__selections").innerText;
    await t
      .expect(UrlAfterChange)
      .contains("secretfortesting")
      .expect(ExpireAfterChange)
      .contains("After 1 day")
      .typeText(Selector(".input-secret input"), InitialSecret, { replace: true })
      .click(Selector(".input-expires input"))
      .click(Selector("div").withText("Never").parent('div[role="listitem"]'))
      .click(Selector("button.action-save"))
      .click(Selector("div.v-expansion-panel__header__icon"));
    const LinkCount = await Selector(".action-url").count;
    await t.click(".action-add-link");
    const LinkCountAfterAdd = await Selector(".action-url").count;
    await t
      .expect(LinkCountAfterAdd)
      .eql(LinkCount + 1)
      .click(Selector("div.v-expansion-panel__header__icon"))
      .click(Selector(".action-delete"));
    const LinkCountAfterDelete = await Selector(".action-url").count;
    await t
      .expect(LinkCountAfterDelete)
      .eql(LinkCountAfterAdd - 1)
      .click(Selector("button.action-close"));
    await this.openNav();
    await t
      .click(".nav-" + type)
      .click("a.uid-" + FirstAlbum + " .action-share")
      .click(Selector("div.v-expansion-panel__header__icon"))
      .click(Selector(".action-delete"));
  }

  async checkButtonVisibility(button, inContextMenu, inAlbum) {
    const FirstAlbum = await Selector("a.is-album").nth(0).getAttribute("data-uid");
    await this.selectFromUID(FirstAlbum);
    await t.click(Selector("button.action-menu"));
    if (inContextMenu) {
      await t.expect(Selector("button.action-" + button).visible).ok();
    } else {
      await t.expect(Selector("button.action-" + button).visible).notOk();
    }
    await this.clearSelection();
    if (t.browser.platform !== "mobile") {
      await t.click(Selector("a.is-album").nth(0));
      if (inAlbum) {
        await t.expect(Selector("button.action-" + button).visible).ok();
      } else {
        await t.expect(Selector("button.action-" + button).visible).notOk();
      }
    }
  }

  async deletePhotoFromUID(uid) {
    await this.selectPhotoFromUID(uid);
    await this.archiveSelected();
    await this.openNav();
    await t.click(Selector(".nav-browse + div")).click(Selector(".nav-archive"));
    await this.selectPhotoFromUID(uid);
    await t
      .click(Selector("button.action-menu", { timeout: 5000 }))
      .click(Selector(".remove"))
      .click(Selector(".action-confirm"))
      .expect(Selector("div").withAttribute("data-uid", uid).exists, { timeout: 5000 })
      .notOk();
  }

  async validateDownloadRequest(request, filename, extension) {
    const downloadedFileName = request.headers["content-disposition"];
    await t
      .expect(request.statusCode === 200)
      .ok()
      .expect(downloadedFileName)
      .contains(filename)
      .expect(downloadedFileName)
      .contains(extension);
    await logger.clear();
  }
}
