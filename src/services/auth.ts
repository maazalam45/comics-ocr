import service from "@/services";

// Login
export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return service({
    method: "POST",
    noAuth: true,
    urlencoded: true,
    url: `/user/signin/`,
    body: {
      email,
      password,
    },
  });
}
export async function loginWithToken({ token }: { token: string }) {
  return service({
    method: "POST",
    noAuth: true,
    url: `/auth/loginWithToken`,
    body: {
      token,
    },
  });
}

export async function getUser(token: string) {
  return service({
    method: "GET",
    url: "/auth/me",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function refreshToken(token: string) {
  return service({
    method: "POST",
    url: "/auth/refresh",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

//Google Auth
export async function googleAuth({ idToken }: { idToken: string }) {
  return service({
    method: "POST",
    noAuth: true,
    url: `/auth/google/login`,
    body: {
      idToken,
    },
  });
}

// Logout
export async function logout() {
  return service({
    parseJSON: false,
    method: "DELETE",
    url: "/user/logout/",
  });
}
