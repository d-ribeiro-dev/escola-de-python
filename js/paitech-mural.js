
"use strict";

const PaitechMural = (() => {

    const SUPABASE_URL =
        "https://nxkucmeorqfcoctqeidk.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_L6sxhZMlgMfcS0nocYVcfQ_v4SMnneB";

    const db = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    // AUTENTICAÇÃO ANÔNIMA

    async function obterUsuario() {
        const { data, error } = await db.auth.getSession();

        if (error) throw error;

        if (data.session) {
            return data.session.user;
        }

        const resultado = await db.auth.signInAnonymously();

        if (resultado.error) {
            throw resultado.error;
        }

        return resultado.data.user;
    }

    // CADASTRAR OU ATUALIZAR PERFIL

    async function publicarPerfil(perfil) {

        const dados = PaitechPerfil.criarPerfil(
            perfil.name,
            perfil.avatar,
            perfil.muralConsent
        );

        if (!dados || !dados.muralConsent) {
            return false;
        }

        const usuario = await obterUsuario();

        const { error } = await db
            .from("colaboradores")
            .upsert({
                user_id: usuario.id,
                nome: dados.name,
                avatar: dados.avatar,
                consentimento: true
            }, {
                onConflict: "user_id"
            });

        if (error) throw error;

        await carregarMural();

        return true;
    }

    // REMOVER O PRÓPRIO PERFIL

    async function removerPerfil() {

        const { data, error: sessionError } =
            await db.auth.getSession();

        if (sessionError) throw sessionError;

        if (!data.session) return true;

        // A política RLS limita a exclusão
        // ao registro do usuário autenticado.

        const { error } = await db
            .from("colaboradores")
            .delete()
            .not("id", "is", null);

        if (error) throw error;

        await carregarMural();

        return true;
    }

    // CARREGAR COLABORADORES

    async function carregarMural() {

        const lista = document.getElementById("muralList");

        if (!lista) return;

        try {

            const { data, error } = await db
                .from("colaboradores")
                .select("id,nome,avatar,created_at")
                .order("created_at", {
                    ascending: true
                })
                .order("id", {
                    ascending: true
                });

            if (error) throw error;

            lista.replaceChildren();

            if (!data.length) {

                mostrarMensagem(
                    lista,
                    "Seja o primeiro colaborador da nossa história!"
                );

                return;
            }

            data.forEach(colaborador => {

                const pessoa = document.createElement("div");
                pessoa.className = "mural-person";

                const avatar = document.createElement("div");
                avatar.className = "mural-person-avatar";
                avatar.textContent = colaborador.avatar;

                const nome = document.createElement("span");
                nome.className = "mural-person-name";
                nome.textContent = colaborador.nome;

                pessoa.append(avatar, nome);
                lista.appendChild(pessoa);

            });

        } catch (error) {

            console.error("Erro ao carregar mural:", error);

            lista.replaceChildren();

            mostrarMensagem(
                lista,
                "Mural temporariamente indisponível."
            );
        }
    }

    function mostrarMensagem(lista, mensagem) {

        const texto = document.createElement("p");

        texto.className = "mural-empty";
        texto.textContent = mensagem;

        lista.appendChild(texto);
    }

    return Object.freeze({
        publicarPerfil,
        removerPerfil,
        carregarMural
    });

})();

PaitechMural.carregarMural();
