import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';

import './App.css';

// 公司治理
const sidebarRoutes = [
  {
    path: '/investor/structure',
    label: '公司治理組織架構',
    element: () => <div className='container'>公司治理架構</div>,
  },
  {
    label: '董事會',
    routes: [
      {
        path: '/investor/board/boardMembers',
        label: '董事會成員介紹',
        element: () => <div className='container'>董事會成員介紹</div>,
      },
      {
        path: '/investor/board/majorResolutions',
        label: '董事會重大決議',
        element: () => <div className='container'>董事會重大決議</div>,
      },
    ],
  },
  {
    path: '/investor/commitee',
    label: '功能性委員會',
    element: () => <div className='container'>功能性委員會</div>,
  },
];

const FallbackRoute = () => <Navigate to='/investor/structure' />;

const SideBar = () => {
  const { pathname } = useLocation();
  const toggleSubmenu = (menuLabel) => {
    const submenu = document.querySelector(
      `.subroutes[data-menu="${menuLabel}"]`
    );

    submenu.classList.remove('is--hidden');
  };

  useEffect(() => {
    // get all nested routes
    const nestedRoutes = sidebarRoutes.filter(
      (route) => route.routes?.length > 0
    );

    // find the parent of current subroute
    nestedRoutes.forEach((route) => {
      route.routes.forEach((subroute) => {
        if (subroute.path === pathname) {
          toggleSubmenu(route.label);
        }
      });
    });
  }, []);

  const renderSidebarListItems = () => {
    return sidebarRoutes.map((route, index) => {
      if (route.routes) {
        return (
          <li
            key={index}
            onClick={() => toggleSubmenu(route.label)}
            data-menu={route.label}
            style={{ cursor: 'pointer' }}
          >
            {route.label}
            <ul className={`subroutes is--hidden`} data-menu={route.label}>
              {route.routes.map((subroute, index) => {
                return (
                  <li key={index}>
                    <Link to={subroute.path}>{subroute.label}</Link>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      } else {
        return (
          <li key={index}>
            <Link to={route.path}>{route.label}</Link>
          </li>
        );
      }
    });
  };

  return <ul>{renderSidebarListItems()}</ul>;
};

const App = () => {
  const renderRouteView = () => {
    return sidebarRoutes.map((route, index) => {
      if (route.routes) {
        return route.routes.map((subroute, index) => {
          return (
            <Route
              key={index}
              path={subroute.path}
              exact={true}
              element={<subroute.element />}
            />
          );
        });
      } else {
        return (
          <Route
            key={index}
            path={route.path}
            exact={true}
            element={<route.element />}
          />
        );
      }
    });
  };

  return (
    <Router>
      <SideBar />
      <div id='main'>
        <Routes>
          <Route path='/investor' exact={true} element={<FallbackRoute />} />
          {renderRouteView()}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
