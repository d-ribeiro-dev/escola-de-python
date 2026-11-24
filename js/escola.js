let currentQuestions = baseQuestions; let mode = 'oficial'; let submitted = false; let currentResult = null;
const $ = id => document.getElementById(id);
function isCorrect(question, selected) {
    if (selected === null || selected === undefined) {
        return false;
    }

    if (question.type === "completion") {
        return question.accepted.includes(
            String(selected).trim()
        );
    }

    return Number(selected) === question.answer;
}

function getCorrectAnswer(question) {
    if (question.type === "completion") {
        return question.accepted.join(" ou ");
    }

    return String.fromCharCode(65 + question.answer)
        + ") " + question.options[question.answer];
}
function renderQuestions() {
    $("questions").innerHTML = currentQuestions.map((q, i) => `
        <article class="question" data-q="${q.id}">
            <div class="qhead">
                <span class="qnum">
                    QUESTÃO ${String(i + 1).padStart(2, "0")}
                </span>
                <span class="topic">${escapeHtml(q.topic)}</span>
            </div>

            <p class="prompt">${escapeHtml(q.prompt)}</p>

            ${q.code ? '<pre class="code"></pre>' : ""}

            ${
                q.type === "completion"
                    ? `
                        <label class="why">
                            Complete o código:
                            <textarea
                                name="answer-${q.id}"
                                placeholder="Digite somente a resposta..."
                                spellcheck="false"
                                rows="2"
                            ></textarea>
                        </label>
                    `
                    : `
                        <div class="options">
                            ${q.options.map((o, j) => `
                                <label class="option">
                                    <input
                                        type="radio"
                                        name="${q.id}"
                                        value="${j}"
                                    >
                                    <span>
                                        ${String.fromCharCode(65 + j)})
                                        ${escapeHtml(o)}
                                    </span>
                                </label>
                            `).join("")}
                        </div>
                    `
            }

            <label class="why">
                Justifique sua resposta
                <small>
                    Sua justificativa não altera a nota objetiva.
                </small>
                <textarea
                    name="why-${q.id}"
                    placeholder="Explique como pensou..."
                ></textarea>
            </label>
        </article>
    `).join("");

    currentQuestions.forEach(q => {
        const pre = document.querySelector(
            `[data-q="${q.id}"] .code`
        );

        if (pre) {
            pre.textContent = q.code;
        }
    });

    document.querySelectorAll(
        "#questions input, #questions textarea"
    ).forEach(el => {
        el.addEventListener("input", updateProgress);
    });

    updateProgress();
}

function updateProgress() {
    const count = collect().filter(
        a => a.selected !== null
    ).length;

    $("progressBar").style.width =
        (count / currentQuestions.length * 100) + "%";

    $("progressText").textContent =
        `${count} de ${currentQuestions.length} questões respondidas`;
}

function collect() {
    return currentQuestions.map(q => {
        let selected = null;

        if (q.type === "completion") {
            selected = document.querySelector(
                `[name="answer-${q.id}"]`
            )?.value.trim() || null;
        } else {
            selected = document.querySelector(
                `input[name="${q.id}"]:checked`
            )?.value ?? null;
        }

        return {
            id: q.id,
            topic: q.topic,
            selected,
            justification: document.querySelector(
                `[name="why-${q.id}"]`
            )?.value.trim() ?? ""
        };
    });
}
function submitExam() {
    if (submitted) return;

    const answers = collect();

    const unanswered = answers.filter(
        a => a.selected === null
    ).length;

    if (unanswered) {
        if (!confirm(
            `Você deixou ${unanswered} questão(ões) sem resposta. Deseja entregar mesmo assim?`
        )) return;
    }

    if (!confirm(
        "A entrega é definitiva. Confirmar entrega?"
    )) return;

    const score = answers.reduce((sum, a, i) => {
        return sum + (
            isCorrect(currentQuestions[i], a.selected) ? 1 : 0
        );
    }, 0);

    currentResult = {
        date: new Date().toISOString(),
        mode,
        level: activeLevel,
        score,
        answers,
        questions: currentQuestions.map(q => ({ ...q }))
    };

    try {
        const history = JSON.parse(
            localStorage.getItem("escolaPythonHistory") || "[]"
        );

        history.unshift(currentResult);

        localStorage.setItem(
            "escolaPythonHistory",
            JSON.stringify(history)
        );
    } catch (error) {
        alert("Não foi possível salvar a avaliação. Tente novamente.");
        console.error(error);
        return;
    }

    submitted = true;

    showResult();
}
function formatSelected(question, selected) {
    if (selected === null || selected === undefined) {
        return "Não respondida";
    }

    if (question.type === "completion") {
        return String(selected);
    }

    return String.fromCharCode(65 + Number(selected))
        + ") " + question.options[Number(selected)];
}

function showResult() {
    mostrarArea("resultPanel");

    const total = currentResult.questions.length;
    const score = currentResult.score;

    const config = examLevels[currentResult.level];

    $("recoveryBtn").classList.toggle(
        "hidden",
        score === total ||
        currentResult.mode === "recuperacao" ||
        !config?.recovery?.length
    );

    $("scoreValue").textContent =
        score.toFixed(1).replace(".", ",") + "/" + total;

    $("scoreLabel").textContent =
        score >= 7
            ? "Bom resultado!"
            : "Vamos identificar o que precisa de reforço.";

    $("scoreDetails").textContent =
        `${score} acertos · ${total - score} para revisar`;

    $("resultMessage").textContent =
        score === total
            ? "Parabéns! Você acertou todas as questões."
            : "Confira a correção e revise os conteúdos que precisam de atenção.";

    $("answerReview").innerHTML =
        currentResult.questions.map((q, i) => {
            const a = currentResult.answers[i];
            const correct = isCorrect(q, a.selected);

            return `
                <div class="result-item">
                    <div class="qhead">
                        <b>
                            Questão ${i + 1} · ${escapeHtml(q.topic)}
                        </b>

                        <span class="status ${correct ? "ok" : "no"}">
                            ${correct ? "ACERTO" : "REVISAR"}
                        </span>
                    </div>

                    <div class="small">
                        Sua resposta:
                        ${escapeHtml(formatSelected(q, a.selected))}
                    </div>

                    <div class="small">
                        Gabarito:
                        ${escapeHtml(getCorrectAnswer(q))}
                    </div>

                    <p class="feedback">
                        ${escapeHtml(q.explain)}
                    </p>

                    <p class="small muted">
                        <b>Sua justificativa:</b>
                        ${escapeHtml(a.justification || "Não preenchida.")}
                    </p>
                </div>
            `;
        }).join("");
}
function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function getLevelName(level) {
    const names = {
        facil: "Fácil",
        basico: "Básico",
        intermediario: "Intermediário",
        dificil: "Difícil",
        impossivel: "Impossível"
    };

    return names[level] || "Fácil";
}

function reportText() {
    const r = currentResult;

    const lines = [
        "APRENDER · PRATICAR · EVOLUIR",
        `Nível: ${getLevelName(r.level)}`,
        `Modalidade: ${r.mode === "recuperacao" ? "Recuperação" : "Avaliação"}`,
        `Data: ${new Date(r.date).toLocaleString("pt-BR")}`,
        `Nota: ${r.score}/${r.questions.length}`,
        ""
    ];

    r.questions.forEach((q, i) => {
        const a = r.answers[i];

        lines.push(
            `Questão ${i + 1} — ${q.topic}`,
            q.prompt,
            q.code || "",
            `Resultado: ${isCorrect(q, a.selected) ? "Acerto" : "Revisar"}`,
            `Resposta: ${formatSelected(q, a.selected)}`,
            `Gabarito: ${getCorrectAnswer(q)}`,
            `Explicação: ${q.explain}`,
            `Justificativa: ${a.justification || "Não preenchida"}`,
            ""
        );
    });

    lines.push(
        "ORIENTAÇÕES PARA ANÁLISE PEDAGÓGICA",
        "Identifique os conhecimentos demonstrados.",
        "Diferencie erros conceituais de questões não respondidas.",
        "Identifique possíveis erros de atenção com base em evidências.",
        "Não presuma a causa dos erros.",
        "Recomende exercícios direcionados às dificuldades identificadas."
    );

    return lines.join("\n");
}
function showHistory() {
    const history = JSON.parse(
        localStorage.getItem("escolaPythonHistory") || "[]"
    );

    $("historyList").innerHTML = history.length
        ? history.map((r, i) => `
            <div class="history-row">
                <div>
                    <b>
                        ${getLevelName(r.level)} ·
                        ${r.mode === "recuperacao"
                            ? "Recuperação"
                            : "Avaliação"}
                        ${history.length - i}
                    </b>

                    <div class="muted small">
                        ${new Date(r.date).toLocaleString("pt-BR")}
                    </div>
                </div>

                <b>${r.score}/${r.questions.length}</b>

                <span class="small status ${r.score >= 7 ? "ok" : "no"}">
                    ${r.score >= 7
                        ? "Bom resultado"
                        : "Em desenvolvimento"}
                </span>
            </div>
        `).join("")
        : '<div class="empty">Nenhuma prova entregue ainda.</div>';

    $("historyPanel").classList.remove("hidden");
}
function mostrarArea(area) {
    const paineis = [
        "homePanel",
        "levelsPanel",
        "examPanel",
        "resultPanel",
        "historyPanel",
        "paitechPanel"
    ];

    paineis.forEach(id => $(id).classList.add("hidden"));

    $(area).classList.remove("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Entrada na Sala de Avaliações
$("openExamBtn").addEventListener("click", () => {
    mostrarArea("levelsPanel");
});

// Retorno da seleção de níveis
$("backFromLevelsBtn").addEventListener("click", () => {
    mostrarArea("homePanel");
});

// Configuração das avaliações disponíveis
const examLevels = {
    facil: {
        questions: baseQuestions,
        recovery: recoveryQuestions,
        title: "Fácil · Fundamentos de Python",
        subtitle: "Variáveis, funções nativas, operadores e strings."
    },
    basico: {
        questions: basicQuestions,
        recovery: basicRecoveryQuestions,
        title: "Básico · Lógica de programação",
        subtitle: "Condicionais, listas, laços e dicionários."
    }
};

let activeLevel = "facil";

// Iniciar ou retomar uma avaliação
function startExam(level) {
    const config = examLevels[level];

    if (!config) return;

    if (!submitted && activeLevel === level && mode === "oficial") {
        $("examTitle").textContent = config.title;
        $("examSubtitle").textContent = config.subtitle;
        mostrarArea("examPanel");
        return;
    }

    if (!submitted && collect().some(
        a => a.selected !== null || a.justification
    )) {
        if (!confirm(
            "Existe uma tentativa em andamento. Deseja descartá-la e iniciar outra?"
        )) return;
    }

    activeLevel = level;
    currentQuestions = config.questions;
    mode = "oficial";
    submitted = false;
    currentResult = null;

    $("examTitle").textContent = config.title;
    $("examSubtitle").textContent = config.subtitle;
    $("examMode").textContent = "PROVA OFICIAL";

    renderQuestions();
    mostrarArea("examPanel");
}

document.querySelectorAll(".level-card").forEach(card => {
    card.addEventListener("click", () => {
        startExam(card.dataset.level);
    });
});
$("openPaitechBtn").addEventListener("click", () => {
    mostrarArea("paitechPanel");
});

// Retorno da Paitech
$("backFromPaitechBtn").addEventListener("click", () => {
    mostrarArea("homePanel");
});

// Retorno da avaliação
$("backFromExamBtn").addEventListener("click", () => {
    mostrarArea("homePanel");
});

// Retorno dos resultados
$("backFromResultBtn").addEventListener("click", () => {
    mostrarArea("homePanel");
});

$("submitBtn").addEventListener("click", submitExam);

// Eventos da tela de resultados

$("historyBtn").addEventListener("click", showHistory);

$("closeHistoryBtn").addEventListener("click", () => {
    $("historyPanel").classList.add("hidden");
});

$("newExamBtn").addEventListener("click", () => {
    mostrarArea("levelsPanel");
});

$("copyBtn").addEventListener("click", async () => {
    if (!currentResult) return;

    try {
        await navigator.clipboard.writeText(reportText());
        alert("Relatório copiado!");
    } catch (error) {
        console.error(error);
        alert("Não foi possível copiar o relatório.");
    }
});

// Inicialização das questões

renderQuestions();

// Sistema de recuperação por nível

function startRecovery() {
    if (!submitted || !currentResult) return;

    const previous = currentResult;
    const level = previous.level;
    const config = examLevels[level];

    if (!config?.recovery?.length) return;
    if (previous.score === previous.questions.length) return;
    if (previous.mode === "recuperacao") return;

    if (!confirm(
        "Deseja iniciar a recuperação? Sua nota anterior será preservada."
    )) return;

    const weakTopics = new Set(
        previous.questions
            .filter((q, i) =>
                !isCorrect(q, previous.answers[i].selected)
            )
            .map(q => q.topic)
    );

    currentQuestions = config.recovery
        .slice()
        .sort((a, b) =>
            Number(weakTopics.has(b.topic)) -
            Number(weakTopics.has(a.topic))
        );

    activeLevel = level;
    mode = "recuperacao";
    submitted = false;
    currentResult = null;

    $("examTitle").textContent =
        `Recuperação · ${getLevelName(level)}`;

    $("examSubtitle").textContent =
        "Nova avaliação com prioridade para os conteúdos que precisam de reforço.";

    $("examMode").textContent = "RECUPERAÇÃO";

    renderQuestions();
    mostrarArea("examPanel");
}

$("recoveryBtn").addEventListener("click", startRecovery);