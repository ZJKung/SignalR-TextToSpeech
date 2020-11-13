"use strict";
(function (n) {
    window.initializeTTSDemo = function (t) {
        n(document).ready(function () {
            function d() {
                var r = n.SpeechTranslationConfig.fromAuthorizationToken(t.token, t.region),
                    i, u;
                r.speechSynthesisOutputFormat = n.SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;
                e = new n.SpeakerAudioDestination;
                e.onAudioEnd = function () {
                    h.hidden = !0;
                    s.hidden = !1
                };
                u = n.AudioConfig.fromSpeakerOutput(e);
                i = new n.SpeechSynthesizer(r, u);
                i.synthesisCompleted = function () {
                    i.close();
                    i = null
                };
                i.SynthesisCanceled = function (i, r) {
                    var u;
                    h.hidden = !0;
                    s.hidden = !1;
                    u = n.CancellationDetails.fromResult(r);
                    u.reason === n.CancellationReason.Error && (c.innerText = t.srTryAgain)
                };
                i.speakSsmlAsync(a.value, function () {}, function (n) {
                    c.innerText = t.srTryAgain + " " + n
                })
            }

            function o() {
                var n = '<prosody rate="{SPEED}" pitch="{PITCH}">{TEXT}<\/prosody>';
                n = n.replace("{SPEED}", u.value + "%");
                n = n.replace("{PITCH}", f.value + "%");
                r.selectedIndex !== 0 && (n = '<mstts:express-as style="{STYLE}">{0}<\/mstts:express-as>'.replace("{0}", n), n = n.replace("{STYLE}", r[r.selectedIndex].value));
                n = '<voice name="{VOICE}">{0}<\/voice>'.replace("{0}", n);
                n = n.replace("{VOICE}", i[i.selectedIndex].value);
                n = '<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">{0}<\/speak>'.replace("{0}", n);
                n = n.replace("{TEXT}", v.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"));
                a.value = n
            }
            var y = document.getElementById("playbtn"),
                s = document.getElementById("playli"),
                p = document.getElementById("stopbtn"),
                h = document.getElementById("stopli"),
                w = document.getElementById("doanloadbtn"),
                l = document.getElementById("languageselect"),
                i = document.getElementById("voiceselect"),
                r = document.getElementById("voicestyleselect"),
                v = document.getElementById("ttstext"),
                a = document.getElementById("ttsssml"),
                c = document.getElementById("ttsstatus"),
                u = document.getElementById("speed"),
                b = document.getElementById("speedlabel"),
                f = document.getElementById("pitch"),
                k = document.getElementById("pitchlabel"),
                e = null,
                n = window.SpeechSDK;
            n = window.SpeechSDK;
            w.onclick = function () {
                var o = n.SpeechTranslationConfig.fromAuthorizationToken(t.token, t.region),
                    l, v, e, u = {},
                    f = 0,
                    r, i;
                c.innerText = "";
                e = {
                    write: function (n) {
                        u[f] = n;
                        f += 1
                    },
                    close: function () {
                        var t = 0,
                            r, n, e;
                        for (i = 0; i < f; i += 1) t += u[i].byteLength;
                        for (r = new window.Uint8Array(t), t = 0, i = 0; i < f; i += 1) r.set(new window.Uint8Array(u[i]), t), t += u[i].byteLength;
                        n = document.createElement("a");
                        e = window.URL.createObjectURL(new Blob([r]));
                        n.href = e;
                        n.download = "synth.mp3";
                        document.body.appendChild(n);
                        n.click();
                        setTimeout(function () {
                            document.body.removeChild(n);
                            window.URL.revokeObjectURL(e)
                        }, 0)
                    }
                };
                o.speechSynthesisOutputFormat = n.SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;
                v = n.PushAudioOutputStream.create(e);
                l = n.AudioConfig.fromStreamOutput(v);
                r = new n.SpeechSynthesizer(o, l);
                r.SynthesisCanceled = function (i, r) {
                    var u;
                    h.hidden = !0;
                    s.hidden = !1;
                    u = n.CancellationDetails.fromResult(r);
                    u.reason === n.CancellationReason.Error && (c.innerText = t.srTryAgain)
                };
                r.synthesisCompleted = function () {
                    e.close();
                    r.close()
                };
                r.speakSsmlAsync(a.value)
            };
            p.onclick = function () {
                s.hidden = !1;
                h.hidden = !0;
                e !== null && e.pause();
                e = null
            };
            y.onclick = function () {
                h.hidden = !1;
                s.hidden = !0;
                c.innerText = "";
                d(function () {})
            };
            l.onchange = function () {
                i.innerHTML = t.ttsVoices[l[l.selectedIndex].value];
                i.onchange();
                o()
            };
            i.onchange = function () {
                r.selectedIndex = 5;
                r.disabled = i[i.selectedIndex].value.includes("Neural") ? !1 : !0;
                o()
            };
            l.onchange();
            i.onchange();
            r.onchange = function () {
                o()
            };
            f.oninput = function () {
                var n = (f.value - f.min) / (f.max - f.min) * 2,
                    i;
                i = Math.abs(n) < 1 ? n.toPrecision(2) : n.toPrecision(3);
                k.innerText = t.ttsPitch + ": " + i
            };
            f.onchange = function () {
                o()
            };
            u.oninput = function () {
                var n = (u.value - u.min) / (u.max - u.min) * 3,
                    i;
                i = Math.abs(n) < 1 ? n.toPrecision(2) : n.toPrecision(3);
                b.innerText = t.ttsSpeed + ": " + i
            };
            u.onchange = function () {
                o()
            };
            v.onchange = function () {
                o()
            }
        })
    }
})(jQuery)