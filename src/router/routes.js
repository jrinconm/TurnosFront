const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        redirect: "login"
      },
      {
        path: "calendario",
        component: () => import("pages/Calendario.vue"),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "informes",
        component: () => import("pages/Informes.vue"),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "settings",
        component: () => import("pages/Settings.vue"),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "admin",
        component: () => import("pages/Admin.vue"),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "alta",
        component: () => import("pages/Alta.vue")
      },
      {
        path: "salir",
        component: () => import("pages/Salir.vue"),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  // Pagina de login
  {
    path: "/",
    component: () => import("layouts/LoginLayout"),
    children: [
      {
        path: "",
        component: () => import("pages/Login.vue")
      },
      {
        path: "login",
        component: () => import("pages/Login.vue")
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
