"use strict";

const PaitechPerfil = (() => {

    const avatares = Object.freeze([
        "👩🏻‍💻",
        "👨🏽‍💻",
        "👩🏿‍🔬",
        "🧑🏼‍🚀",
        "👩🏽‍🎨",
        "🧑🏻‍💼",
        "🤖",
        "🐱"
    ]);

    function avatarValido(avatar) {
        return avatares.includes(avatar);
    }

    function nomeValido(nome) {
        return typeof nome === "string"
            && nome.trim().length >= 1
            && nome.trim().length <= 40;
    }

    function criarPerfil(nome, avatar, consentimento) {
        if (!nomeValido(nome) || !avatarValido(avatar)) {
            return null;
        }

        return {
            name: nome.trim(),
            avatar: avatar,
            muralConsent: consentimento === true
        };
    }

    return Object.freeze({
        avatares,
        avatarValido,
        nomeValido,
        criarPerfil
    });

})();