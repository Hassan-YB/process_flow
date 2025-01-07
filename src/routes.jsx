import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';

// project import
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

// ==============================|| ROUTES ||============================== //

const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

export const routes = [
  {
    exact: 'true',
    path: '/auth/signup',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    exact: 'true',
    path: '/auth/verify',
    element: lazy(() => import('./views/auth/signin/VerifyOtp'))
  },
  {
    exact: 'true',
    path: '/auth/signin',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/reset-password',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    exact: 'true',
    path: '/auth/password-otp-verify',
    element: lazy(() => import('./views/auth/reset-password/forgot-password-verify'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/change-password',
        element: lazy(() => import('./views/auth/reset-password/ChangePassword'))
      },
      {
        exact: 'true',
        path: '/dashboard',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: '/pricing',
        element: lazy(() => import('./views/payments/Pricing'))
      },
      {
        exact: 'true',
        path: '/checkout',
        element: lazy(() => import('./views/payments/Checkout'))
      },
      {
        exact: 'true',
        path: '/subscriptions',
        element: lazy(() => import('./views/payments/SubscriptionList'))
      },
      {
        exact: 'true',
        path: '/invoices',
        element: lazy(() => import('./views/payments/Invoices'))
      },
      {
        exact: 'true',
        path: '/billing',
        element: lazy(() => import('./views/payments/Invoicing'))
      },
      {
        exact: 'true',
        path: '/profile',
        element: lazy(() => import('./views/profile/Profile'))
      },
      {
        exact: 'true',
        path: '/basic/button',
        element: lazy(() => import('./views/ui-elements/BasicButton'))
      },
      {
        exact: 'true',
        path: '/basic/badges',
        element: lazy(() => import('./views/ui-elements/BasicBadges'))
      },
      {
        exact: 'true',
        path: '/basic/breadcrumb-pagination',
        element: lazy(() => import('./views/ui-elements/BasicBreadcrumbPagination'))
      },
      {
        exact: 'true',
        path: '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/BasicCollapse'))
      },

      {
        exact: 'true',
        path: '/basic/typography',
        element: lazy(() => import('./views/ui-elements/BasicTypography'))
      },
      {
        exact: 'true',
        path: '/basic/tooltip-popovers',
        element: lazy(() => import('./views/ui-elements/BasicTooltipsPopovers'))
      },
      {
        exact: 'true',
        path: '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to='/auth/signin' />
      }
    ]
  }
];

export default renderRoutes;
