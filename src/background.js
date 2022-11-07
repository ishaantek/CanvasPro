chrome.runtime.onInstalled.addListener((details) => {
  const oldDefaults = {
    "canvaspro-setting-quicklink": false,
    "canvaspro-setting-search": true,
    "canvaspro-setting-smartscroll": true,
    "canvaspro-display-appearance": "light",
    "canvaspro-setting-convopeeker": true,
    "canvaspro-setting-hidelogo": true,
    "canvaspro-setting-sidebar-color": "#1b7ecf",
    "canvaspro-setting-active-sidebar-color": {
      background: "darker",
      icon: "white",
    },
    "canvaspro-setting-sidebar-icon-color": "white",
    "canvaspro-setting-sidebar-more-spacing": true,
    "canvaspro-setting-roundermodules": true,
    "canvaspro-setting-linkcolor": "use default",
    "canvaspro-setup-stage": 0,
    "canvaspro-current-version": "0.4.4",
    "canvaspro-setting-sidebar-drawer": true,
    "canvaspro-setting-sidebar-drawer-excluded": [
      "Dashboard",
      "Courses",
      "Calendar",
      "Inbox",
      "Settings",
      "Search",
    ],
    "canvaspro-setting-sidebar-drawer-all-items": ["Settings", "Search"],
    "canvaspro-birthday-confetti": false,
    "canvaspro-allow-surveys": true,
    "canvaspro-survey-seed-1": Math.random(),
    "canvaspro-survey": 0,
    "canvaspro-rating": false,
    "canvaspro-setting-sidebar-icon-size": 3,
    "canvaspro-setting-sidebar-show-settings": true,
  };

  const newDefaults = {
    "canvaspro-setting-quizrefill": true,
  };

  if (details.reason === "install") {
    chrome.tabs.create({
      url: "https://canvas.ishaantek.com/welcome.html",
    });
    chrome.storage.local.set(newDefaults);
    chrome.storage.local.set(oldDefaults);
    chrome.storage.local.set({
      installDate: {
        timestamp: Date.now(),
        from: "install",
      },
    });
  } else if (
    details.reason === "update" &&
    (details.previousVersion === "0.4.1")
  ) {
    //chrome.storage.local.set({"canvaspro-current-version": "0.4"}) // canvasjs will detect new version
    chrome.storage.local.set(newDefaults);
  }
});
