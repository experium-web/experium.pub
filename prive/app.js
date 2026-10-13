(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const panels = ["login-panel", "reset-panel", "private-panel", "unavailable-panel"];
  const show = id => panels.forEach(panel => $(panel).classList.toggle("hidden", panel !== id));
  const message = (id, text) => { $(id).textContent = text; };
  const config = window.EXPERIUM_AUTH_CONFIG || {};
  const validConfig = /^https:\/\//.test(config.url || "") &&
    !(config.url || "").includes("REMPLACER") &&
    (config.publishableKey || "").startsWith("sb_publishable_") &&
    !(config.publishableKey || "").includes("REMPLACER");

  if (!validConfig || !window.supabase?.createClient) {
    show("unavailable-panel");
    return;
  }

  const client = window.supabase.createClient(config.url, config.publishableKey, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
  });
  let recoveryMode = false;

  async function refresh() {
    if (recoveryMode) { show("reset-panel"); return; }
    const { data, error } = await client.auth.getUser();
    if (error || !data?.user) { show("login-panel"); return; }

    const user = data.user;
    const { data: member, error: memberError } = await client
      .from("private_members").select("user_id").eq("user_id", user.id).maybeSingle();
    if (memberError) {
      show("login-panel");
      message("login-feedback", "Vérification des autorisations impossible. Veuillez réessayer.");
      return;
    }
    if (!member) {
      show("private-panel");
      message("welcome", "Compte connecté : " + (user.email || ""));
      $("private-content").replaceChildren();
      const p = document.createElement("p");
      p.textContent = "Ce compte n'a pas encore été autorisé à consulter l'espace privé.";
      $("private-content").append(p);
      return;
    }

    show("private-panel");
    message("welcome", "Bienvenue, " + (user.email || "collaborateur") + ".");
    message("private-feedback", "");
    const area = $("private-content");
    area.replaceChildren();
    const { data: pages, error: pagesError } = await client
      .from("private_pages").select("id,title,body").order("id", { ascending: true });
    if (pagesError) {
      message("private-feedback", "Impossible de récupérer les informations privées.");
      return;
    }
    if (!pages?.length) {
      const p = document.createElement("p");
      p.textContent = "Aucun contenu n'a encore été ajouté à cet espace.";
      area.append(p);
      return;
    }
    for (const page of pages) {
      const article = document.createElement("article");
      article.className = "item";
      const title = document.createElement("h2");
      title.textContent = page.title;
      const body = document.createElement("p");
      body.textContent = page.body;
      article.append(title, body);
      area.append(article);
    }
  }

  client.auth.onAuthStateChange(event => {
    if (event === "PASSWORD_RECOVERY") {
      recoveryMode = true;
      show("reset-panel");
    }
  });

  $("login-form").addEventListener("submit", async event => {
    event.preventDefault();
    message("login-feedback", "");
    const button = $("login-button");
    button.disabled = true;
    try {
      const email = $("email").value.trim();
      const password = $("password").value;
      const { error } = await client.auth.signInWithPassword({ email, password });
      $("password").value = "";
      if (error) {
        message("login-feedback", "Connexion impossible. Vérifiez vos identifiants.");
        return;
      }
      await refresh();
    } catch {
      message("login-feedback", "Un problème de connexion est survenu.");
    } finally {
      button.disabled = false;
    }
  });

  $("forgot-button").addEventListener("click", async () => {
    const email = $("email").value.trim();
    if (!email) {
      message("login-feedback", "Inscrivez d'abord votre adresse courriel.");
      $("email").focus();
      return;
    }
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: new URL("./", window.location.href).href
    });
    message("login-feedback", error
      ? "Impossible de traiter la demande pour le moment."
      : "Si cette adresse possède un compte, un courriel de réinitialisation sera envoyé.");
  });

  $("reset-form").addEventListener("submit", async event => {
    event.preventDefault();
    const newPassword = $("new-password").value;
    if (newPassword.length < 12) {
      message("reset-feedback", "Utilisez au moins 12 caractères.");
      return;
    }
    const { error } = await client.auth.updateUser({ password: newPassword });
    $("new-password").value = "";
    if (error) {
      message("reset-feedback", "La mise à jour a échoué. Veuillez réessayer.");
      return;
    }
    recoveryMode = false;
    message("reset-feedback", "");
    await refresh();
  });

  $("logout-button").addEventListener("click", async () => {
    const { error } = await client.auth.signOut();
    if (error) {
      message("private-feedback", "Déconnexion impossible. Veuillez réessayer.");
      return;
    }
    $("private-content").replaceChildren();
    message("login-feedback", "");
    show("login-panel");
  });

  refresh().catch(() => {
    show("login-panel");
    message("login-feedback", "Impossible de vérifier la session.");
  });
})();
