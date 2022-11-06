const defaults = {
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
  "canvaspro-setting-sidebar-icon-size": 3,
  "canvaspro-setting-sidebar-more-spacing": true,
  "canvaspro-setting-roundermodules": true,
  "canvaspro-setting-linkcolor": "use default",
  "canvaspro-setting-sidebar-show-settings": true,
  "canvaspro-setting-quizrefill": false,
  "canvaspro-setup-stage": 0,
};

const settingsList = Object.keys(defaults);
let settings = {};

chrome.storage.local.get(settingsList, function (data) {
  settings = data;

  let setupStage = settings["canvaspro-setup-stage"] ?? -1;

  if (setupStage === 0) {
    createFinishSettingUp(settings["canvaspro-display-appearance"]);
  }
});

let alert = document.createElement("div");
alert.id = "canvaspro-alert";
alert.style.opacity = "0";
alert.style.visibility = "hidden";
alert.addEventListener("click", function (evt) {
  if (evt.target !== this) return;

  this.style.opacity = "0";
  this.style.visibility = "hidden";
});

/*useReactiveFeatures([{
  settingName: "canvaspro-setting-quicklink",
  onChanged: (val) => {
    settingchanged(val, "canvaspro-setting-quicklink")
  }
}])*/

const createFinishSettingUp = (selectedAppearance) => {
  const popup = document.createElement("div");
  popup.className = "canvaspro-finish-setting-up-wrapper";
  popup.innerHTML = `
    <div class='canvaspro-finish-setting-up'>
      <h3 class='canvaspro-finish-setting-up__Header'>Finish Setting Up</h3>
      <div class='canvaspro-finish-setting-up__DisplayHeader'>Chose a Look</div>
      <div class='canvaspro-finish-setting-up__DisplayWrapper'>
        <div class='canvaspro-finish-setting-up__DisplayOption light ${
          selectedAppearance === "light" ? "selected" : ""
        }'>
          <img src='${chrome.runtime.getURL("assets/img/light.png")}' />
          <p>Default</p>
        </div>
        <div class='canvaspro-finish-setting-up__DisplayOption dim ${
          selectedAppearance.startsWith("dim") ? "selected" : ""
        }'>
          <img src='${chrome.runtime.getURL("assets/img/dim.png")}' />
          <p>Dim</p>
          <label><input type="checkbox" ${
            selectedAppearance.startsWith("dim") &&
            selectedAppearance.endsWith("auto")
              ? "checked"
              : ""
          }></input><p>Sync with OS</p></label>
        </div>
        <div class='canvaspro-finish-setting-up__DisplayOption dark ${
          selectedAppearance.startsWith("dark") ? "selected" : ""
        }'>
          <img src='${chrome.runtime.getURL("assets/img/dark.png")}' />
          <p>Dark</p>
          <label><input type="checkbox" ${
            selectedAppearance.startsWith("dark") &&
            selectedAppearance.endsWith("auto")
              ? "checked"
              : ""
          }></input><p>Sync with OS</p></label>
        </div>
      </div>
      <div class='canvaspro-finish-setting-up__ExtensionMenu'>
        <img src='${chrome.runtime.getURL("assets/img/extension-menu.png")}'/>
        <div>
          <p>Extension Settings</p>
          <p>If you need to recolor your sidebar, toggle features, or change your appearance later, you can do it all from the extension settings.</p>
        </div>
      </div>
      <div class='canvaspro-finish-setting-up__Footer'>
        <button class='canvaspro-finish-setting-up__Done'>Done</button>
      </div>
    </div>
  `;
  const colorscheme = (e) => {
    if (originalappearance == "auto") {
      document.querySelector(
        ".canvaspro-finish-setting-up__DisplayOption.auto"
      ).children[0].src = chrome.runtime.getURL(
        "assets/img/" + (e.matches ? "light" : "dark") + ".png"
      );
    }
  };

  const select = (appearance) => {
    popup
      .querySelectorAll(".canvaspro-finish-setting-up__DisplayOption.selected")
      .forEach((ele) => {
        ele.classList.remove("selected");
        chrome.storage.local.set({
          "canvaspro-display-appearance": appearance,
        });
      });
    if (appearance.endsWith("_auto"))
      appearance = appearance.substring(0, appearance.length - 5);

    popup
      .querySelector(
        `.canvaspro-finish-setting-up__DisplayOption.${appearance}`
      )
      .classList.add("selected");
  };
  const getColor = () => {
    const colors = [
      "#e0245e",
      "#ffad1f",
      "#85c924",
      "#40afe3",
      "#6b54ff",
      "#fc74e1",
      "#515975",
      "#222a42",
      "#b5043a",
      "#f45d22",
      "#17bf63",
      "#1059e3",
      "#794bc4",
      "#c840e3",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  popup
    .querySelector(".canvaspro-finish-setting-up__DisplayOption.light")
    .addEventListener("click", () => {
      if (
        popup.querySelector(
          ".canvaspro-finish-setting-up__DisplayOption input:checked"
        )
      ) {
        popup.querySelector(
          ".canvaspro-finish-setting-up__DisplayOption input:checked"
        ).checked = false;
      }
      select("light");
    });
  popup
    .querySelector(".canvaspro-finish-setting-up__DisplayOption.dim")
    .addEventListener("click", () => {
      popup.querySelector(
        ".canvaspro-finish-setting-up__DisplayOption.dark input"
      ).checked = false;
      setTimeout(() => {
        const checkbox = popup.querySelector(
          ".canvaspro-finish-setting-up__DisplayOption.dim input"
        );
        select(checkbox?.checked ? "dim_auto" : "dim");
      }, 0);
    });
  popup
    .querySelector(".canvaspro-finish-setting-up__DisplayOption.dark")
    .addEventListener("click", () => {
      popup.querySelector(
        ".canvaspro-finish-setting-up__DisplayOption.dim input"
      ).checked = false;
      setTimeout(() => {
        const checkbox = popup.querySelector(
          ".canvaspro-finish-setting-up__DisplayOption.dark input"
        );
        select(checkbox?.checked ? "dark_auto" : "dark");
      }, 0);
    });
  popup
    .querySelector(".canvaspro-finish-setting-up__Done")
    .addEventListener("click", () => {
      popup.classList.add("closing");
      setTimeout(() => {
        document.body.removeChild(popup);
        window.matchMedia("(prefers-color-scheme: light)").onchange = null;
      }, 1000);
      chrome.storage.local.set({
        "canvaspro-setup-stage": 1,
        "canvaspro-setting-sidebar-color": `linear-gradient(45deg, ${getColor()}, ${getColor()})`,
      });
    });
  document.body.appendChild(popup);
  matchMedia("(prefers-color-scheme: light)").onchange = (e) => {
    colorscheme(e);
  };
};

chrome.storage.local.get(["canvaspro-birthday-confetti"], (data) => {
  const current = data["canvaspro-birthday-confetti"];

  if (
    current !== true &&
    Math.floor(
      (new Date() -
        new Date(new Date().getFullYear(), 0, 0) +
        (new Date(new Date().getFullYear(), 0, 0).getTimezoneOffset() -
          new Date().getTimezoneOffset()) *
          60 *
          1000) /
        86400000
    ) === 13
  ) {
    var maxParticleCount = 150;
    var particleSpeed = 2;
    var startConfetti;
    var stopConfetti;
    var toggleConfetti;
    var removeConfetti;
    (function () {
      startConfetti = startConfettiInner;
      stopConfetti = stopConfettiInner;
      toggleConfetti = toggleConfettiInner;
      removeConfetti = removeConfettiInner;
      var colors = [
        "DodgerBlue",
        "OliveDrab",
        "Gold",
        "Pink",
        "SlateBlue",
        "LightBlue",
        "Violet",
        "PaleGreen",
        "SteelBlue",
        "SandyBrown",
        "Chocolate",
        "Crimson",
      ];
      var streamingConfetti = false;
      var animationTimer = null;
      var particles = [];
      var waveAngle = 0;
      function resetParticle(particle, width, height) {
        particle.color = colors[(Math.random() * colors.length) | 0];
        particle.x = Math.random() * width;
        particle.y = Math.random() * height - height;
        particle.diameter = Math.random() * 10 + 5;
        particle.tilt = Math.random() * 10 - 10;
        particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
        particle.tiltAngle = 0;
        return particle;
      }
      function startConfettiInner() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        window.requestAnimFrame = (function () {
          return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
              return window.setTimeout(callback, 16.6666667);
            }
          );
        })();
        var canvas = document.getElementById("confetti-canvas");
        if (canvas === null) {
          canvas = document.createElement("canvas");
          canvas.setAttribute("id", "confetti-canvas");
          canvas.setAttribute(
            "style",
            "position:fixed;top:0px;left:0px;z-index:999999;pointer-events:none"
          );
          document.body.appendChild(canvas);
          canvas.width = width;
          canvas.height = height;
          window.addEventListener(
            "resize",
            function () {
              canvas.width = window.innerWidth;
              canvas.height = window.innerHeight;
            },
            true
          );
        }
        var context = canvas.getContext("2d");
        while (particles.length < maxParticleCount)
          particles.push(resetParticle({}, width, height));
        streamingConfetti = true;
        if (animationTimer === null) {
          (function runAnimation() {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            if (particles.length === 0) animationTimer = null;
            else {
              updateParticles();
              drawParticles(context);
              animationTimer = requestAnimFrame(runAnimation);
            }
          })();
        }
      }
      function stopConfettiInner() {
        streamingConfetti = false;
      }
      function removeConfettiInner() {
        stopConfetti();
        particles = [];
      }
      function toggleConfettiInner() {
        if (streamingConfetti) stopConfettiInner();
        else startConfettiInner();
      }
      function drawParticles(context) {
        var particle;
        var x;
        for (var i = 0; i < particles.length; i++) {
          particle = particles[i];
          context.beginPath();
          context.lineWidth = particle.diameter;
          context.strokeStyle = particle.color;
          x = particle.x + particle.tilt;
          context.moveTo(x + particle.diameter / 2, particle.y);
          context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
          context.stroke();
        }
      }
      function updateParticles() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var particle;
        waveAngle += 0.01;
        for (var i = 0; i < particles.length; i++) {
          particle = particles[i];
          if (!streamingConfetti && particle.y < -15) particle.y = height + 100;
          else {
            particle.tiltAngle += particle.tiltAngleIncrement;
            particle.x += Math.sin(waveAngle);
            particle.y +=
              (Math.cos(waveAngle) + particle.diameter + particleSpeed) * 0.5;
            particle.tilt = Math.sin(particle.tiltAngle) * 15;
          }
          if (
            particle.x > width + 20 ||
            particle.x < -20 ||
            particle.y > height
          ) {
            if (streamingConfetti && particles.length <= maxParticleCount)
              resetParticle(particle, width, height);
            else {
              particles.splice(i, 1);
              i--;
            }
          }
        }
      }
    })();
    startConfetti();
    let confettiRunning = true;

    setTimeout(() => {
      confettiRunning = false;
      stopConfetti();
    }, 5000);

    chrome.storage.local.set({ "canvaspro-birthday-confetti": true });

    notification(
      "Canvas Pro is now a year old! Thanks for supporting us along the journey, we have lots of new features coming soon!",
      "cake",
      "#ffcff0",
      "#ff66dd",
      (notification, dismissMe, e) => {
        dismissMe();
      },
      "Done"
    ).then(({ image }) => {
      image.addEventListener("click", () => {
        if (!confettiRunning) {
          confettiRunning = true;
          startConfetti();

          setTimeout(() => {
            confettiRunning = false;
            stopConfetti();
          }, 1500);
        }
      });
    });
  }
});

chrome.storage.local.get(["canvaspro-current-version"], (data) => {
  const current = data["canvaspro-current-version"];

  if (current !== "0.4.4") {
    // notification(
    //   "Speed up your productivity! Quiz refill imports your previous quiz response with the press of a button.",
    //   "tada",
    //   "#dff2c9",
    //   "#85ba49",
    //   (notification, dismissMe, e) => {
    //     chrome.storage.local.set({ "canvaspro-current-version": "0.4.4" });
    //     dismissMe();
    //   },
    //   "Dismiss"
    // );
    // notification(
    //   "As a proactive measure, we've updated our academic honesty policy and security.",
    //   "siren",
    //   "#ffd9db",
    //   "#ba1c24",
    //   (notification, dismissMe, e) => {
    //     chrome.storage.local.set({ "canvaspro-current-version": "0.4.4" });
    //     dismissMe();
    //   },
    //   "Dismiss",
    //   (notification, dismissMe, e) => {
    //     window.open("https://canvaspro.org/update/academic-honesty");
    //     dismissMe();
    //   },
    //   "More Info",
    //   "#deb8ba"
    // );
  }
});

const doSurvey = () => {
  // const surveysettings = { "canvaspro-setting-quicklink": "Speed+Boost", "canvaspro-setting-search": "Search", "canvaspro-setting-smartscroll": "Smart+Scrolling", "canvaspro-display-appearance": {'light': 'Default+(Light)', 'dim': 'Dim', 'dark': 'Lights+Out', 'auto': 'Auto'}, "canvaspro-setting-convopeeker": "Quick+Inbox", "canvaspro-setting-hidelogo": "Hide+Logo", "canvaspro-setting-sidebar-color": 'use default', "canvaspro-setting-roundermodules": "Rounder+Modules", "canvaspro-setting-linkcolor": 'use default' }
  const surveySettings = [
    "canvaspro-setting-search",
    "canvaspro-setting-smartscroll",
    "canvaspro-setting-quicklink",
    "canvaspro-setting-roundermodules",
    "canvaspro-setting-convopeeker",
    "canvaspro-setting-hidelogo",
    "canvaspro-setting-sidebar-more-spacing",
    "canvaspro-setting-sidebar-show-settings",
    "canvaspro-display-appearance",
    "canvaspro-setting-sidebar-color",
    "canvaspro-setting-sidebar-icon-size",
    "canvaspro-setting-sidebar-drawer",
    "canvaspro-setting-sidebar-drawer-excluded",
    "canvaspro-setting-linkcolor",
    "installDate",
  ];

  chrome.storage.local.get(surveySettings, (data) => {
    const url =
      "https://docs.google.com/forms/d/e/1FAIpQLScHWEI7TY5W6DWSqRGaUWTlxLYHKAhcdwUvywvW_oj7MmM9Pw/viewform?usp=pp_ur" +
      (data["canvaspro-setting-search"] ? "&entry.1198748745=Search" : "") +
      (data["canvaspro-setting-smartscroll"]
        ? "&entry.1198748745=Smart+Scrolling"
        : "") +
      (data["canvaspro-setting-quicklink"]
        ? "&entry.1198748745=Speed+Boost"
        : "") +
      (data["canvaspro-setting-roundermodules"]
        ? "&entry.1198748745=Rounder+Modules"
        : "") +
      (data["canvaspro-setting-convopeeker"]
        ? "&entry.1198748745=Quick+Inbox"
        : "") +
      (data["canvaspro-setting-hidelogo"]
        ? "&entry.1198748745=Hide+Sidebar+Logo"
        : "") +
      (data["canvaspro-setting-sidebar-more-spacing"]
        ? "&entry.1198748745=Sidebar+More+Spacing"
        : "") +
      (data["canvaspro-setting-sidebar-show-settings"]
        ? "&entry.1198748745=Sidebar+Setting+Icon"
        : "") +
      `&entry.1404289257=${
        (() => {
          switch (data["canvaspro-display-appearance"]) {
            case "dim":
              return "Dim+(Always+on)";
            case "dim_auto":
              return "Dim+(Synced+with+OS)";
            case "dark":
              return "Dark+(Always+on)";
            case "dark_auto":
              return "Dark+(Synced+with+OS)";
          }
        })() ?? "Default+(Light)"
      }` +
      `&entry.1808318442=${
        data["canvaspro-setting-sidebar-color"]
          ? `__other_option__&entry.1808318442.other_option_response=${encodeURIComponent(
              data["canvaspro-setting-sidebar-color"]
            )}`
          : "Unset"
      }` +
      `&entry.2146677563=${data["canvaspro-setting-sidebar-icon-size"]}` +
      `&entry.2001245057=${
        data["canvaspro-setting-sidebar-drawer"]
          ? `__other_option__&entry.2001245057.other_option_response=${encodeURIComponent(
              JSON.stringify(data["canvaspro-setting-sidebar-drawer-excluded"])
            )}`
          : "Setting+disabled"
      }` +
      `&entry.1599750073=${
        data["canvaspro-setting-linkcolor"]
          ? `__other_option__&entry.1599750073.other_option_response=${encodeURIComponent(
              data["canvaspro-setting-linkcolor"]
            )}`
          : "Unset"
      }` +
      `&entry.1159662235=${
        navigator.userAgent.indexOf("Firefox") > -1
          ? "Firefox"
          : "Chrome/Chromium"
      }` +
      `&entry.1858991990=${encodeURIComponent(
        JSON.stringify(data["installDate"])
      )}`;

    injectsurvey(url);
  });
  //var url = 'https://docs.google.com/forms/d/e/1FAIpQLScHWEI7TY5W6DWSqRGaUWTlxLYHKAhcdwUvywvW_oj7MmM9Pw/viewform?usp=pp_url';

  // for (rotation = 0; rotation < Object.entries(data).length; rotation++) {
  //   var hexurl = undefined
  //   url += (Object.entries(data)[rotation][1] == true ? '&entry.1198748745=' + surveysettings[Object.entries(data)[rotation][0]] : '');
  //   url += (Object.entries(data)[rotation][0] == "canvaspro-display-appearance" ? '&entry.1404289257=' + surveysettings["canvaspro-display-appearance"][Object.entries(data)[rotation][1]] : '');
  //   Object.entries(data)[rotation][0] == "canvaspro-setting-sidebar-color" ? hexurl = '&entry.1808318442' : Object.entries(data)[rotation][0] == "canvaspro-setting-linkcolor" ? hexurl = '&entry.1599750073' : undefined;
  //   url += (hexurl != undefined ? (data[Object.entries(data)[rotation][0]] == "" || data[Object.entries(data)[rotation][0]] == "use default" ? hexurl + '=' + 'Unset' : (Object.entries(data)[rotation][1]).split('#')[0] == "linear-gradient(45deg, " ? hexurl + '=__other_option__' + hexurl + '.other_option_response=' + ((Object.entries(data)[rotation][1]).split('#')[0]).toString() + '%23' + ((Object.entries(data)[rotation][1]).split('#')[1]).toString() + '%23' + ((Object.entries(data)[rotation][1]).split('#')[2]).toString() : hexurl + '=__other_option__' + hexurl + '.other_option_response=%23' + ((Object.entries(data)[rotation][1]).split('#')[1])) : '');
  // } url += navigator.userAgent.indexOf('Firefox') > -1 ? '&entry.1159662235=Firefox' : '&entry.1159662235=Chrome%5CChromium'; injectsurvey(url)});

  const injectsurvey = (url) => {
    const survey = document.createElement("div");
    survey.className = "cpx-survey-wrapper";

    const surveyBackground = document.createElement("div");
    surveyBackground.className = "cpx-survey__Background";
    surveyBackground.addEventListener("click", () => {
      survey.remove();
    });

    const surveyFrame = document.createElement("iframe");
    surveyFrame.src = url;
    surveyFrame.innerText = "Loading ...";
    surveyFrame.className = "cpx-survey__Frame";

    survey.appendChild(surveyBackground);
    survey.appendChild(surveyFrame);

    document.body.appendChild(survey);

    chrome.storage.local.set({ "canvaspro-survey": true });
  };
};

chrome.storage.local.get(
  [
    "canvaspro-survey",
    "installDate",
    "canvaspro-allow-surveys",
    "canvaspro-survey-seed-1",
  ],
  (data) => {
    fetch("https://ishaantek.com/remote.json").then((remoteData) => {
      remoteData.json().then((remoteData) => {
        const seedPct = data["canvaspro-survey-seed-1"] ?? 0;
        const rolloutPct = remoteData["survey-1-rollout-pct"] ?? 0;
        if (seedPct >= rolloutPct) return;

        const viewed = data["canvaspro-survey"];

        if (data["canvaspro-allow-surveys"] === false) return;

        const time =
          Math.round(new Date() / 86400000) -
          Math.round(data["installDate"]["timestamp"] / 86400000);
        if (viewed === true) return;
        if (Date.now() - viewed >= 475200000 && time >= 14) {
          notification(
            "Help us make Canvas Pro better! Consider taking this short survey about new improvements we can make!",
            "draw",
            "#fff1e6",
            "#e5a573",
            (notification, dismissMe, e) => {
              doSurvey();
              dismissMe();
            },
            "Survey",
            (notification, dismissMe, e) => {
              chrome.storage.local.set({ "canvaspro-survey": Date.now() });

              const snackbar = setSnackbar(
                [
                  {
                    type: "text",
                    text: "You'll be asked about the survey again in a few days.",
                  },
                  {
                    type: "spacer",
                    spacing: "10px",
                  },
                  {
                    type: "button-hstack",
                    buttons: [
                      {
                        text: "Take Survey",
                        onClick: () => {
                          doSurvey();
                          removeSnackbar(snackbar);
                        },
                      },
                      {
                        text: "Opt Out",
                        textColor: "var(--ic-brand-font-color-dark)",
                        backgroundColor:
                          "var(--cpt-dark-snackbar-code-segment-color, #e1e1e1)",
                        onClick: () => {
                          removeSnackbar(snackbar);

                          chrome.storage.local.set({
                            "canvaspro-allow-surveys": false,
                          });

                          const snackbar2 = setSnackbar([
                            {
                              type: "text",
                              text: "Your survey settings have been updated",
                            },
                          ]);
                          setTimeout(() => {
                            removeSnackbar(snackbar2);
                          }, 2500);
                        },
                      },
                    ],
                  },
                ],
                "large"
              );

              setTimeout(() => {
                removeSnackbar(snackbar);
              }, 4500);

              dismissMe();
            },
            "Maybe Later",
            "#ffe4cf"
          );
        }
      });
    });
  }
);

// chrome.storage.local.get(["canvaspro-rating", "installDate"], (data) => {
//   const viewed = data["canvaspro-rating"]
//   const time = Math.round(new Date / 86400000) - Math.round(data["installDate"]['timestamp'] / 86400000)

//   if (viewed !== true &&  time >= 20) {
//     notification("Seems like you've been using Canvas Pro for a whlie now. Please consider rating it, it helps us grow.", "star", "#e6f8ff", "#1791c0", (notification, dismissMe, e) => {
//       window.open(navigator.userAgent.indexOf('Firefox') > -1 ? "https://addons.mozilla.org/en-US/firefox/addon/canvaspro/reviews/?utm_source=firefox-browser&utm_medium=firefox-browser&utm_content=addons-manager-reviews-link" : "https://chrome.google.com/webstore/detail/canvas%2B/kdkadcnebmokaadholinmnpjelphnghh/reviews");
//       chrome.storage.local.set({"canvaspro-rating": true})
//       dismissMe()
//     }, "Rate", (notification, dismissMe, e) => {
//       chrome.storage.local.set({"canvaspro-rating": true})
//       dismissMe()
//     }, "Maybe Later", "#caf0ff")
//   }
// })
