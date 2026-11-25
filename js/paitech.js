
"use strict";

(() => {
    const STORAGE_KEY = "paitechCareer";
    const TOTAL_DEMANDAS = 20;

    const panel = document.getElementById("paitechPanel");
    const content = panel.querySelector(".paitech-content");
    const reception = content.innerHTML;

    let career = loadCareer();

    // =====================================
    // ARMAZENAMENTO
    // =====================================

    function loadCareer() {
        try {
            const data = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "null"
            );

            if (!data || typeof data.name !== "string") {
                return null;
            }

            const ids = Array.isArray(data.completedIds)
                ? data.completedIds
                : [];

            const validIds = [];

            for (let i = 0; i < ids.length && i < TOTAL_DEMANDAS; i++) {
                if (ids[i] !== i + 1) break;
                validIds.push(ids[i]);
            }

            const xp = validIds.reduce(
                (total, id) =>
                    total + PaitechCarreira.calcularXP(id),
                0
            );

            const cargo = PaitechCarreira.obterCargo(xp);

            return {
                ...data,
                avatar: PaitechPerfil.avatarValido(data.avatar)
                    ? data.avatar
                    : "🤖",
                muralConsent: data.muralConsent === true,
                xp,
                role: cargo.nome,
                salary: cargo.salario,
                completed: validIds.length,
                completedIds: validIds
            };

        } catch (error) {
            console.error("Erro ao carregar carreira:", error);
            return null;
        }
    }

    function saveCareer(data) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );

            return true;

        } catch (error) {
            console.error(error);
            alert("Não foi possível salvar sua carreira.");
            return false;
        }
    }

    function money(value) {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function goHome() {
        showReception();
        mostrarArea("homePanel");
    }

    // =====================================
    // RECEPÇÃO
    // =====================================

    function showReception() {
        content.innerHTML = reception;

        const startBtn = document.getElementById(
            "startPaitechBtn"
        );

        startBtn.disabled = false;

        startBtn.textContent = career
            ? "Continuar minha jornada"
            : "Iniciar minha jornada";

        startBtn.addEventListener("click", () => {
            if (career) {
                showCareer();
            } else {
                showAdmission();
            }
        });

        document.getElementById("backFromPaitechBtn")
            .addEventListener("click", goHome);
    }

    // =====================================
    // ADMISSÃO
    // =====================================
    function showAdmission() {
        content.innerHTML = `
            <div class="paitech-welcome">
                <span class="paitech-location">
                    📍 Sala do supervisor
                </span>
                <h2>Uma nova oportunidade</h2>
            </div>

            <div class="paitech-dialogue">
                <div class="paitech-avatar">👨‍💼</div>
                <div>
                    <h3>Supervisor</h3>
                    <p>
                        Olá! A recepcionista me avisou
                        sobre sua chegada.
                    </p>
                    <p>
                        Estamos com algumas demandas atrasadas
                        e precisamos de alguém disposto a
                        aprender e resolver problemas.
                    </p>
                    <p>
                        Não exigimos experiência profissional.
                        Aqui, você terá a oportunidade de
                        demonstrar seus conhecimentos na prática.
                    </p>
                </div>
            </div>

            <form id="paitechAdmissionForm"
            class="paitech-admission">

                <h3>Ficha de admissão</h3>

                <label for="paitechName">
                    Como podemos chamar você?
                </label>

                <input
                    id="paitechName"
                    type="text"
                    placeholder="Nome ou apelido"
                    maxlength="40"
                    autocomplete="off"
                    required
                >
<fieldset class="paitech-avatar-field">
    <legend>Escolha seu avatar</legend>

    <div class="paitech-avatar-grid">
        ${PaitechPerfil.avatares.map((avatar, index) => `
            <label class="paitech-avatar-choice">
                <input
                    type="radio"
                    name="paitechAvatar"
                    value="${index}"
                    aria-label="Avatar ${index + 1}"
                    ${index === 0 ? "checked" : ""}
                >
                <span>${avatar}</span>
            </label>
        `).join("")}
    </div>
</fieldset>

<label class="paitech-consent">
    <input type="checkbox" id="paitechMuralConsent">

    <span>
        Quero fazer parte da história da Paitech
        e autorizo a exibição pública do meu nome
        ou apelido e avatar no Mural de Colaboradores.
    </span>
</label>

<small>
    A participação no mural é opcional.
    A publicação será disponibilizada quando
    o mural estiver conectado.
</small>

                <p><strong>Cargo:</strong> Estagiário(a)</p>
                <p><strong>Experiência:</strong> 0 XP</p>
                <p><strong>Salário fictício:</strong> R$ 800,00</p>
                <p><strong>Demandas concluídas:</strong> 0/20</p>

                <div class="paitech-actions">
                    <button class="btn primary" type="submit">
                        Aceitar oportunidade
                    </button>

                    <button class="btn secondary"
                            id="backToReception"
                            type="button">
                        Voltar à recepção
                    </button>
                </div>
            </form>
        `;

        document.getElementById("backToReception")
            .addEventListener("click", showReception);

        document.getElementById("paitechAdmissionForm")
            .addEventListener("submit", event => {
                event.preventDefault();

                const name = document.getElementById(
                    "paitechName"
                ).value.trim();

                if (!name) {
                    alert("Informe um nome ou apelido.");
                    return;
                }

                const avatarIndex = Number(
    document.querySelector(
        'input[name="paitechAvatar"]:checked'
    ).value
);

const consent = document.getElementById(
    "paitechMuralConsent"
).checked;

const profile = PaitechPerfil.criarPerfil(
    name,
    PaitechPerfil.avatares[avatarIndex],
    consent
);

if (!profile) {
    alert("Confira os dados do seu perfil.");
    return;
}

const newCareer = {
    ...profile,
    role: "Estagiário(a)",
                    xp: 0,
                    salary: 800,
                    completed: 0,
                    completedIds: [],
                    admittedAt: new Date().toISOString()
                };

                if (saveCareer(newCareer)) {
                    career = newCareer;
                    showCareer();
                }
            });
    }

    // =====================================
    // PAINEL PROFISSIONAL
    // =====================================

    function showCareer() {
        const next = PaitechCarreira.proximoCargo(career.xp);
        const progress = PaitechCarreira.calcularProgresso(
            career.xp
        );

        content.innerHTML = `
            <div class="paitech-welcome">
                <span class="paitech-location">
                    📍 Área do colaborador
                </span>
                <h2 id="careerWelcome"></h2>
                <p>Acompanhe sua evolução profissional.</p>
            </div>

            <div class="paitech-admission">
            <div class="paitech-profile-header">
    <div class="paitech-profile-info">
        <h3 id="careerRole"></h3>
        <strong id="careerProfileName"></strong>
        <small>Equipe Paitech</small>
    </div>

    <div class="paitech-profile-avatar"
    id="careerAvatar"></div>
</div>

                <div class="paitech-stats">
                    <div class="paitech-stat">
                        <small>Experiência</small>
                        <strong>${career.xp} XP</strong>
                    </div>

                    <div class="paitech-stat">
                        <small>Salário fictício</small>
                        <strong>${money(career.salary)}</strong>
                    </div>

                    <div class="paitech-stat">
                        <small>Demandas</small>
                        <strong>${career.completed}/20</strong>
                    </div>
                </div>

                <div class="paitech-progress">
                    <small id="promotionLabel"></small>

                    <div class="paitech-progress-track"
                         role="progressbar"
                         aria-label="Progresso até a próxima promoção"
                         aria-valuemin="0"
                         aria-valuemax="100"
                         aria-valuenow="${progress}">
                        <div style="width:${progress}%"></div>
                    </div>
                </div>
            </div>

            <div class="paitech-dialogue">
                <div class="paitech-avatar">👨‍💼</div>
                <div>
                    <h3>Supervisor</h3>
                    <p id="supervisorMessage"></p>
                </div>
            </div>

            <div class="paitech-actions">
                <button class="btn primary"
                        id="openDemandsBtn"
                        type="button">
                    Acessar demandas
                </button>

                <button class="btn secondary"
        id="editProfileBtn"
        type="button">
    👤 Editar meu perfil
</button>

                <button class="btn secondary"
                        id="careerExitBtn"
                        type="button">
                    Voltar ao início
                </button>
            </div>
        `;

        document.getElementById("careerWelcome")
            .textContent = `Bem-vindo(a), ${career.name}!`;

        document.getElementById("careerRole")
            .textContent = career.role;

        document.getElementById("careerProfileName")
    .textContent = career.name;

document.getElementById("careerAvatar")
    .textContent = career.avatar;    

        document.getElementById("promotionLabel")
            .textContent = next
                ? `Próxima promoção: ${next.nome} — faltam ${next.xp - career.xp} XP`
                : "Você alcançou o cargo máximo! 🏆";

        document.getElementById("supervisorMessage")
            .textContent = career.completed === 0
                ? "Prepare seu café. Temos nosso primeiro chamado aguardando atendimento!"
                : career.completed === TOTAL_DEMANDAS
                    ? "Parabéns! Você concluiu todas as demandas."
                    : "Bom trabalho! Vamos continuar de onde paramos.";

        document.getElementById("openDemandsBtn")
            .addEventListener("click", showDemands);

        document.getElementById("editProfileBtn")
    .addEventListener("click", showEditProfile);    

        document.getElementById("careerExitBtn")
            .addEventListener("click", goHome);
    }

    // =====================================
    // CENTRAL DE DEMANDAS
    // =====================================

    function showDemands() {
        content.innerHTML = `
            <div class="paitech-welcome">
                <span class="paitech-location">
                    📍 Central de chamados
                </span>
                <h2>Demandas de trabalho</h2>
                <p>
                    ${career.completed} de 20 demandas concluídas
                    · ${career.xp} XP acumulados
                </p>
            </div>

            <div id="paitechDemandList"
                 class="paitech-demand-list"></div>

            <div class="paitech-actions">
                <button class="btn secondary"
                        id="backToCareerBtn"
                        type="button">
                    Voltar à minha carreira
                </button>
            </div>
        `;

        const list = document.getElementById(
            "paitechDemandList"
        );

        for (let id = 1; id <= TOTAL_DEMANDAS; id++) {

            const demanda = PaitechDemandas.find(
                item => item.id === id
            );

            const completed = career.completedIds.includes(id);

            const available =
                Boolean(demanda)
                && id === career.completed + 1;

            const card = document.createElement("button");

            card.type = "button";
            card.className = "paitech-demand-card";
            card.disabled = !available;

            if (completed) {
                card.classList.add("demand-completed");
            }

            const number = document.createElement("small");

            number.textContent =
                `CHAMADO #${String(id).padStart(3, "0")}`;

            const title = document.createElement("strong");

            title.textContent = demanda
                ? demanda.titulo
                : "Demanda técnica";

            const client = document.createElement("span");

            client.textContent = demanda
                ? demanda.cliente
                : "Expediente técnico";

            const status = document.createElement("small");

            status.textContent = completed
                ? "✓ Concluído"
                : !demanda
                    ? "Em preparação"
                    : available
                        ? "Disponível"
                        : "🔒 Bloqueado";

            const reward = document.createElement("small");

            reward.textContent =
                `${PaitechCarreira.calcularXP(id)} XP`;

            card.append(number, title, client, status, reward);

            if (available) {
                card.addEventListener("click", () => {
                    showDemand(id);
                });
            }

            list.appendChild(card);
        }

        document.getElementById("backToCareerBtn")
            .addEventListener("click", showCareer);
    }

    // =====================================
    // ATENDIMENTO AO CLIENTE
    // =====================================

    function showDemand(id) {
        const demanda = PaitechDemandas.find(
            item => item.id === id
        );

        if (!demanda || id !== career.completed + 1) {
            showDemands();
            return;
        }

        content.innerHTML = `
            <div class="paitech-welcome">
                <span class="paitech-location">
                    📍 Atendimento ao cliente
                </span>

                <h2 id="demandTitle"></h2>
                <p id="demandClient"></p>
            </div>

            <div class="paitech-dialogue">
                <div class="paitech-avatar">👤</div>
                <div>
                    <h3>Mensagem do cliente</h3>
                    <p id="demandMessage"></p>
                </div>
            </div>

            <div class="paitech-admission">
                <h3>Código recebido</h3>
                <pre class="code" id="demandCode"></pre>
                <p id="demandTask"></p>

                <form id="demandForm">
                    <div id="demandAnswers"></div>

                    <div class="paitech-actions">
                        <button class="btn primary"
                                id="submitDemandBtn"
                                type="submit">
                            Entregar solução
                        </button>

                        <button class="btn secondary"
                                id="exitDemandBtn"
                                type="button">
                            Voltar aos chamados
                        </button>
                    </div>
                </form>
            </div>

            <div id="demandFeedback"
                 class="paitech-dialogue hidden"
                 role="status"
                 aria-live="polite"></div>

            <div id="demandNextActions"
                 class="paitech-actions hidden">

                <button class="btn primary"
                        id="nextDemandBtn"
                        type="button">
                    Continuar expediente
                </button>

                <button class="btn secondary"
                        id="returnCareerBtn"
                        type="button">
                    Minha carreira
                </button>
            </div>
        `;

        document.getElementById("demandTitle")
            .textContent = demanda.titulo;

        document.getElementById("demandClient")
            .textContent =
            `${demanda.cliente} · ${demanda.nivel} · ${PaitechCarreira.calcularXP(id)} XP`;

        document.getElementById("demandMessage")
            .textContent = demanda.mensagem;

        document.getElementById("demandCode")
            .textContent = demanda.codigo;

        document.getElementById("demandTask")
            .textContent = demanda.tarefa;

        const answers = document.getElementById(
            "demandAnswers"
        );

        if (demanda.tipo === "multipla") {

            demanda.opcoes.forEach((option, index) => {

                const label = document.createElement("label");
                label.className = "paitech-option";

                const input = document.createElement("input");
                input.type = "radio";
                input.name = "demandAnswer";
                input.value = String(index);
                input.required = true;

                const text = document.createElement("span");
                text.textContent = option;

                label.append(input, text);
                answers.appendChild(label);
            });

        } else if (demanda.tipo === "completar") {

            const label = document.createElement("label");
            label.htmlFor = "demandTextAnswer";
            label.textContent = "Sua solução";

            const input = document.createElement("input");
            input.type = "text";
            input.id = "demandTextAnswer";
            input.placeholder = "Digite sua resposta";
            input.autocomplete = "off";
            input.spellcheck = false;
            input.required = true;

            answers.append(label, input);
        }

        document.getElementById("exitDemandBtn")
            .addEventListener("click", showDemands);

        document.getElementById("nextDemandBtn")
            .addEventListener("click", showDemands);

        document.getElementById("returnCareerBtn")
            .addEventListener("click", showCareer);

        let finished = false;

        document.getElementById("demandForm")
            .addEventListener("submit", event => {
                event.preventDefault();

                if (finished) return;

                let correct = false;

                if (demanda.tipo === "multipla") {

                    const selected = answers.querySelector(
                        'input[name="demandAnswer"]:checked'
                    );

                    correct = selected !== null
                        && Number(selected.value) === demanda.resposta;

                } else if (demanda.tipo === "completar") {

                    const answer = document.getElementById(
                        "demandTextAnswer"
                    ).value.trim();

                    correct = demanda.aceitas.includes(answer);
                }

                if (!correct) {
                    showFeedback(
                        "Chamado devolvido para revisão",
                        demanda.dica,
                        false
                    );

                    return;
                }

                const result = PaitechCarreira.concluirDemanda(
                    career, id
                );

                if (!result) {
                    showDemands();
                    return;
                }

                if (!saveCareer(result.carreira)) {
                    return;
                }

                career = result.carreira;
                finished = true;

                let message = demanda.feedback;

                message += ` Você recebeu ${result.recompensa} XP.`;

                if (result.promovido) {
                    message += ` Promoção! Seu novo cargo é ${career.role}. Novo salário fictício: ${money(career.salary)}.`;
                }

                if (result.trofeu) {
                    message += " 🏆 Você conquistou o troféu Especialista Paitech!";
                }

                showFeedback(
                    "Chamado resolvido!",
                    message,
                    true
                );

                document.getElementById("demandForm")
                    .classList.add("hidden");

                document.getElementById("demandNextActions")
                    .classList.remove("hidden");
            });
    }

    // =====================================
    // FEEDBACK DO SUPERVISOR
    // =====================================

    function showFeedback(title, message, success) {
        const feedback = document.getElementById(
            "demandFeedback"
        );

        feedback.replaceChildren();

        feedback.classList.remove(
            "hidden",
            "feedback-success",
            "feedback-retry"
        );

        feedback.classList.add(
            success ? "feedback-success" : "feedback-retry"
        );

        const avatar = document.createElement("div");
        avatar.className = "paitech-avatar";
        avatar.textContent = "👨‍💼";

        const body = document.createElement("div");

        const heading = document.createElement("h3");
        heading.textContent = title;

        const text = document.createElement("p");
        text.textContent = message;

        body.append(heading, text);
        feedback.append(avatar, body);
    }

// =====================================
// EDIÇÃO DO PERFIL PROFISSIONAL
// =====================================

function showEditProfile() {
    content.innerHTML = `
        <div class="paitech-welcome">
            <span class="paitech-location">
                📍 Perfil profissional
            </span>
            <h2>Meu perfil</h2>
            <p>Personalize sua identidade na Paitech.</p>
        </div>

        <form id="editProfileForm"
              class="paitech-admission">

            <label for="editProfileName">
                Nome ou apelido
            </label>

            <input
                id="editProfileName"
                type="text"
                maxlength="40"
                required
            >

            <fieldset class="paitech-avatar-field">
                <legend>Escolha seu avatar</legend>

                <div class="paitech-avatar-grid">
                    ${PaitechPerfil.avatares.map((avatar, index) => `
                        <label class="paitech-avatar-choice">
                            <input
                                type="radio"
                                name="editAvatar"
                                value="${index}"
                                aria-label="Avatar ${index + 1}"
                                ${avatar === career.avatar ? "checked" : ""}
                            >
                            <span>${avatar}</span>
                        </label>
                    `).join("")}
                </div>
            </fieldset>

            <label class="paitech-consent">
                <input type="checkbox"
                       id="editMuralConsent">

                <span>
                    Autorizo a exibição pública do meu
                    nome ou apelido e avatar no
                    Mural de Colaboradores.
                </span>
            </label>

            <small>
                A publicação estará disponível quando
                o mural estiver conectado.
                Alterar seu perfil não modifica seu
                progresso profissional.
            </small>

            <div class="paitech-actions">
                <button class="btn primary" type="submit">
                    Salvar perfil
                </button>

                <button class="btn secondary"
                        id="cancelProfileEdit"
                        type="button">
                    Cancelar
                </button>
            </div>
        </form>
    `;

    document.getElementById("editProfileName")
        .value = career.name;

    document.getElementById("editMuralConsent")
        .checked = career.muralConsent;

    document.getElementById("cancelProfileEdit")
        .addEventListener("click", showCareer);

    document.getElementById("editProfileForm")
        .addEventListener("submit", event => {
            event.preventDefault();

            const name = document.getElementById(
                "editProfileName"
            ).value.trim();

            const selected = document.querySelector(
                'input[name="editAvatar"]:checked'
            );

            if (!selected) {
                alert("Escolha um avatar.");
                return;
            }

            const avatar = PaitechPerfil.avatares[
                Number(selected.value)
            ];

            const consent = document.getElementById(
                "editMuralConsent"
            ).checked;

            const profile = PaitechPerfil.criarPerfil(
                name, avatar, consent
            );

            if (!profile) {
                alert("Confira os dados do perfil.");
                return;
            }

            const updatedCareer = {
                ...career,
                ...profile
            };

            if (saveCareer(updatedCareer)) {
                career = updatedCareer;
                showCareer();
            }
        });
}


    // =====================================
    // INICIALIZAÇÃO
    // =====================================

    showReception();

    if (new URLSearchParams(window.location.search).get("paitech") === "1") {
        mostrarArea("paitechPanel");
    }

})();
