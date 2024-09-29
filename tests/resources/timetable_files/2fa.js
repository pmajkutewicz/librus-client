
function render({manualLink, CTALink, title, content, CTALinkNewTab, background, textColor}) {
    const template = document.createElement("template");
    template.innerHTML = `
        <div class="container static">
            <div
              class="container"
              id="missing-2fa-warning__root"
              role="alertdialog"
              aria-labelledby="missing-2fa-warning__title"
              aria-describedby="missing-2fa-warning__description"
            >
              <div role="document" class="container-background missing-2fa-warning__dialog-body" tabindex="0">
                <div class="missing-2fa-warning__row">
                    <h2 id="missing-2fa-warning__title" class="missing-2fa-warning__title"></h2>
                    <button class="missing-2fa-warning__close-btn" aria-label="zamknij"></button>
                </div>
                <p class="missing-2fa-warning__description" id="missing-2fa-warning__description"></p>
                <div class="missing-2fa-warning__row">
                    <a href="/" target="_blank" rel="noreferrer" class="missing-2fa-warning__link missing-2fa-warning__link-manual">Instrukcja postępowania <span aria-hidden="true">>></span></a>
                    <a href="/" class="missing-2fa-warning__link-btn missing-2fa-warning__link-cta">Włącz dodatkowe zabezpieczenie</a>
                </div>
              </div>
            </div>        
        </div>
    `;
    const filledIn = template.content.cloneNode(true);

    const root = filledIn.querySelector("#missing-2fa-warning__root");
    filledIn.querySelector(".missing-2fa-warning__dialog-body").style.background = background;
    root.style.color = textColor;
    filledIn.querySelector(".missing-2fa-warning__link-manual").setAttribute("href", manualLink);

    filledIn.querySelector(".missing-2fa-warning__link-cta").setAttribute("href", CTALink);
    if (CTALinkNewTab) {
        filledIn.querySelector(".missing-2fa-warning__link-cta").setAttribute("target", "_blank");
    }

    filledIn.querySelector(".missing-2fa-warning__title").textContent = title;
    filledIn.querySelector(".missing-2fa-warning__description").textContent = content;
    $(filledIn.querySelectorAll(".missing-2fa-warning__link-btn")).button();

    function close() {
        $(root).hide("slow");
        fetch("/twoFactorAuthentication/ad/close", {method: "POST"});
    }

    filledIn.querySelector(".missing-2fa-warning__close-btn").addEventListener("click", close);

    return filledIn;
}

async function getContent() {
    return (await fetch("/twoFactorAuthentication/ad/get")).json();
}

async function run() {
    const content = await getContent();
    if (content) {
        const mountPoint = document.getElementById("missing-2fa-warning");
        mountPoint.appendChild(render(content));
    }
}

run();