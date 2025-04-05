document.addEventListener("DOMContentLoaded", () => {
    // Contador de tempo
    function atualizarContador() {
        const inicio = new Date("2020-04-06T00:00:00");
        const agora = new Date();

        let anos = agora.getFullYear() - inicio.getFullYear();
        let meses = agora.getMonth() - inicio.getMonth();
        let dias = agora.getDate() - inicio.getDate();

        if (dias < 0) {
            meses -= 1;
            const mesAnterior = new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
            dias += mesAnterior;
        }

        if (meses < 0) {
            anos -= 1;
            meses += 12;
        }

        const horas = agora.getHours();
        const minutos = agora.getMinutes();
        const segundos = agora.getSeconds();

        document.getElementById("contador").innerText =
            `${anos} anos, ${meses} meses, ${dias} dias, ${horas}h ${minutos}m ${segundos}s`;
    }

    // chama a função logo ao carregar
    atualizarContador();
    setInterval(atualizarContador, 1000);

    // Botão para revelar mensagem e tocar música
    document.getElementById("botaoLeia").addEventListener("click", () => {
        document.getElementById("mensagemOculta").style.display = "block";
        iniciarFogos();

        // Tocar música
        const musica = document.getElementById("musica");
        if (musica) {
            musica.play().catch((e) => {
                console.log("Autoplay bloqueado até interação com usuário:", e);
            });
        }
    });

    // Fogos de artifício
    function iniciarFogos() {
        const canvas = document.getElementById("fireworks");
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let fogos = [];

        class Fogo {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height;
                this.vx = (Math.random() - 0.5) * 4;
                this.vy = Math.random() * -10 - 6;
                this.explodiu = false;
                this.particulas = [];
            }

            atualizar() {
                if (!this.explodiu) {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vy += 0.2;
                    if (this.vy >= 0) {
                        this.explodiu = true;
                        for (let i = 0; i < 30; i++) {
                            this.particulas.push(new Particula(this.x, this.y));
                        }
                    }
                } else {
                    this.particulas.forEach(p => p.atualizar());
                }
            }

            desenhar() {
                if (!this.explodiu) {
                    ctx.fillStyle = "yellow";
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    this.particulas.forEach(p => p.desenhar());
                }
            }
        }

        class Particula {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 6;
                this.vy = (Math.random() - 0.5) * 6;
                this.alpha = 1;
            }

            atualizar() {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= 0.02;
            }

            desenhar() {
                ctx.fillStyle = `rgba(255, ${Math.random() * 255}, 0, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function animar() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            fogos.push(new Fogo());
            fogos.forEach((f, i) => {
                f.atualizar();
                f.desenhar();
                if (f.explodiu && f.particulas.every(p => p.alpha <= 0)) {
                    fogos.splice(i, 1);
                }
            });
            requestAnimationFrame(animar);
        }

        animar();
    }

    // Carrossel de imagens
    const imagens = document.querySelectorAll("#carousel img");
    let indiceAtual = 0;

    function trocarImagem() {
        imagens[indiceAtual].classList.remove("active");
        indiceAtual = (indiceAtual + 1) % imagens.length;
        imagens[indiceAtual].classList.add("active");
    }

    if (imagens.length > 0) {
        imagens[0].classList.add("active");
        setInterval(trocarImagem, 1000);
    }
});
