import axios from "axios";

export const ApiUrl = "https://api.inspireai.com.br";
export const token = "inspireToken";
export const refreshToken = "inspireRefreshToken";
export const localHost = "http://10.0.0.143:3333";
export let ngrok =
  "https://7398-2804-f08-967-4a00-951c-2530-49d2-9e4f.ngrok-free.app/";

if (ngrok.endsWith("/")) {
  ngrok = ngrok.slice(0, -1);
}

export const baseURL = ApiUrl;

export const api = axios.create({
  baseURL,
});

export const PostAPI = async (url: string, data: unknown) => {
  const connect = await api
    .post(url, data)
    .then(({ data }) => {
      return {
        status: 200,
        body: data,
      };
    })
    .catch((err) => {
      const message = err.response.data;
      const status = err.response.status;
      return { status, body: message };
    });

  return connect.status === 500
    ? { status: connect.status, body: "Ops! algo deu errado, tente novamente" }
    : connect.status === 413
      ? {
          status: connect.status,
          body: "Ops! algo deu errado, tente novamente ou escolha outra imagem",
        }
      : connect;
};

export const PutAPI = async (url: string, data: unknown) => {
  const connect = await api
    .put(url, data)
    .then(({ data }) => {
      return {
        status: 200,
        body: data,
      };
    })
    .catch((err) => {
      const message = err.response.data;
      const status = err.response.status;
      return { status, body: message };
    });

  return connect.status === 500
    ? { status: connect.status, body: "Ops! algo deu errado, tente novamente" }
    : connect.status === 413
      ? {
          status: connect.status,
          body: "Ops! algo deu errado, tente novamente ou escolha outra imagem",
        }
      : connect;
};

export const getAPI = async (url: string) => {
  const connect = await api
    .get(url)
    .then(({ data }) => {
      return {
        status: 200,
        body: data,
      };
    })
    .catch((err) => {
      const message = err.response.data;
      const status = err.response.status;
      return { status, body: message };
    });

  return connect.status === 500
    ? { status: connect.status, body: "Ops! algo deu errado, tente novamente" }
    : connect.status === 413
      ? {
          status: connect.status,
          body: "Ops! algo deu errado, tente novamente ou escolha outra imagem",
        }
      : connect;
};

export const authGetAPI = async (url: string, token: string | undefined) => {
  if (!token) {
    return { status: 400, body: null };
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "any",
    },
  };
  const connect = await api
    .get(url, config)
    .then(({ data }) => {
      return {
        status: 200,
        body: data,
      };
    })
    .catch((err) => {
      const message = err.response.data;
      const status = err.response.status;
      return { status, body: message };
    });

  return connect.status === 500
    ? { status: connect.status, body: "Ops! algo deu errado, tente novamente" }
    : connect.status === 413
      ? {
          status: connect.status,
          body: "Ops! algo deu errado, tente novamente ou escolha outra imagem",
        }
      : connect;
};

export const authDeleteAPI = async (url: string, token: string | undefined) => {
  if (!token) {
    return { status: 400, body: null };
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "any",
    },
  };

  const connect = await api
    .delete(url, config)
    .then(({ data }: { data: unknown }) => {
      return {
        status: 200,
        body: data,
      };
    })
    .catch((err: { response: { data: unknown; status: number } }) => {
      const message = err.response.data;
      const status = err.response.status;
      return { status, body: message };
    });

  return connect.status === 500
    ? { status: connect.status, body: "Ops! algo deu errado, tente novamente" }
    : connect.status === 413
      ? {
          status: connect.status,
          body: "Ops! algo deu errado, tente novamente ou escolha outra imagem",
        }
      : connect;
};
export const AuthPostAPI = async (
  url: string,
  data: unknown,
  token: string | undefined,
) => {
  if (!token) {
    return { status: 400, body: null };
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "any",
    },
  };

  const connect = await api
    .post(url, data, config)
    .then(({ data }) => {
      return {
        status: 200,
        body: data,
      };
    })
    .catch((err) => {
      const message = err.response.data;
      const status = err.response.status;
      return { status, body: message };
    });
  return connect.status === 500
    ? { status: connect.status, body: "Ops! algo deu errado, tente novamente" }
    : connect.status === 413
      ? {
          status: connect.status,
          body: "Ops! algo deu errado, tente novamente ou escolha outra imagem",
        }
      : connect;
};

export const AuthPutAPI = async (
  url: string,
  data: unknown,
  token: string | undefined,
) => {
  if (!token) {
    return { status: 400, body: null };
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "any",
    },
  };

  const connect = await api
    .put(url, data, config)
    .then(({ data }: { data: unknown }) => {
      return {
        status: 200,
        body: data,
      };
    })
    .catch((err: { response: { data: unknown; status: number } }) => {
      const message = err.response.data;
      const status = err.response.status;
      return { status, body: message };
    });

  return connect.status === 500
    ? { status: connect.status, body: "Ops! algo deu errado, tente novamente" }
    : connect.status === 413
      ? {
          status: connect.status,
          body: "Ops! algo deu errado, tente novamente ou escolha outra imagem",
        }
      : connect;
};

export const loginVerifyAPI = async ({ token }: { token: string }) => {
  if (!token) {
    return {
      status: 400,
      body: null,
    };
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "any",
    },
  };

  const connect = await fetch(`${baseURL}/Admin/token`, {
    method: "PATCH",
    headers: config.headers,
  });

  const data = await connect.json();
  const status = connect.status;

  return {
    status,
    body: data,
  };
};
