"use strict";

const PaitechCarreira = (() => {

    const cargos = Object.freeze([
        { xp: 0, nome: "Estagiário(a)", salario: 800 },
        { xp: 300, nome: "Assistente técnico", salario: 1800 },
        { xp: 1000, nome: "Desenvolvedor Júnior", salario: 3500 },
        { xp: 1800, nome: "Desenvolvedor Pleno", salario: 6000 },
        { xp: 2400, nome: "Especialista Paitech", salario: 9500 }
    ].map(cargo => Object.freeze(cargo)));

    function calcularXP(numeroDemanda) {
        if (!Number.isInteger(numeroDemanda)) return 0;

        if (numeroDemanda >= 1 && numeroDemanda <= 6) {
            return 50;
        }

        if (numeroDemanda >= 7 && numeroDemanda <= 13) {
            return 100;
        }

        if (numeroDemanda >= 14 && numeroDemanda <= 20) {
            return 200;
        }

        return 0;
    }

    function obterCargo(xp) {
        return [...cargos].reverse().find(
            cargo => xp >= cargo.xp
        ) || cargos[0];
    }

    function proximoCargo(xp) {
        return cargos.find(cargo => cargo.xp > xp) || null;
    }

    function calcularProgresso(xp) {
        const atual = obterCargo(xp);
        const proximo = proximoCargo(xp);

        if (!proximo) return 100;

        return Math.max(0, Math.min(100, Math.round(
            ((xp - atual.xp) / (proximo.xp - atual.xp)) * 100
        )));
    }

    function concluirDemanda(carreira, numeroDemanda) {
        const recompensa = calcularXP(numeroDemanda);

        if (!recompensa) {
            return null;
        }

        const concluidas = carreira.completedIds || [];

        if (concluidas.includes(numeroDemanda)) {
            return null;
        }

        if (numeroDemanda !== concluidas.length + 1) {
            return null;
        }

        const novosXP = carreira.xp + recompensa;
        const cargoAnterior = obterCargo(carreira.xp);
        const novoCargo = obterCargo(novosXP);

        return {
            carreira: {
                ...carreira,
                xp: novosXP,
                role: novoCargo.nome,
                salary: novoCargo.salario,
                completed: concluidas.length + 1,
                completedIds: [...concluidas, numeroDemanda]
            },
            recompensa: recompensa,
            promovido: novoCargo.nome !== cargoAnterior.nome,
            trofeu: concluidas.length + 1 === 20
        };
    }

    return Object.freeze({
        calcularXP,
        obterCargo,
        proximoCargo,
        calcularProgresso,
        concluirDemanda
    });

})();