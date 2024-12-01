export const authErrors = {
  'NOT_AUTHORIZED': { error: 'Sem autorização', status: 401 },
  "INVALID_CREDENTIALS": { error: "Campos inválidos", status: 401 },
  "UNKNOWN_ERROR": { error: "Erro desconhecido", status: 500 },
  "OVER_EMAIL_SEND_RATE_LIMIT": { error: "Você atingiu o limite de envio de e-mails", status: 429 },
  "EMAIL_NOT_CONFIRMED": { error: "Email não confirmado", status: 401 },
  "PASSWORD_MISMATCH": { error: "Senhas não conferem", status: 401 },
  "Email link is invalid or has expired": { error: "Link de email inválido ou expirado", status: 403 },
};


// { error:  authErrors["NOT_AUTHORIZED"].error}, { status: authErrors["NOT_AUTHORIZED"].status }