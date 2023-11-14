import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const { pathname } = useLocation();

  const defaultCrumbs = {
    home: { label: 'Home', path: '/' },
    problems: { label: 'Problems', path: '/problems' },
    problemesNew: { label: 'New Problem', path: '/problems/new' },
    submissions: { label: 'Submissions', path: '/submissions' },
    submissionsNew: { label: 'New Submission', path: '/submissions/new' },
    notes: { label: 'Notes', path: '/notes' },
    notesNew: { label: 'New Note', path: '/notes/new' },
  } as any;

  const urlRegex =
    /(?<firstLevel>problems|submissions|notes)(\/(?:(?<firstLevelId>\d+)|(?<firstLevelAction>\w+)))?\/?(?<secondLevel>submissions|notes)?\/?(?:(?<secondLevelId>\d+)|(?<secondLevelAction>\w+))?\/?(?<thirdLevel>notes)?\/?(?:(?<thirdLevelId>\d+)|(?<thirdLevelAction>\w+))?/;

  const groups = urlRegex.exec(pathname)?.groups as any;

  // console.log({
  //   firstLevel: groups?.firstLevel,
  //   firstLevelId: groups?.firstLevelId,
  //   firstLevelAction: groups?.firstLevelAction,
  //   secondLevel: groups?.secondLevel,
  //   secondLevelId: groups?.secondLevelId,
  //   secondLevelAction: groups?.secondLevelAction,
  //   thirdLevel: groups?.thirdLevel,
  //   thirdLevelId: groups?.thirdLevelId,
  //   thirdLevelAction: groups?.thirdLevelAction,
  // });

  const [crumbs, setCrumbs] = React.useState<
    { label: string; path?: string }[]
  >([]);

  useEffect(() => {
    const c = [];

    if (groups?.firstLevel) {
      c.push(defaultCrumbs[groups?.firstLevel]);
    }

    if (groups?.firstLevelId) {
      c.push({
        label: groups?.firstLevelId,
        path: `/${groups?.firstLevel}/${groups?.firstLevelId}`,
      });
    }

    if (groups?.firstLevelAction) {
      c.push({
        label: groups?.firstLevelAction,
        path: `/${groups?.firstLevel}/${groups?.firstLevelAction}`,
      });
    }

    if (groups?.secondLevel) {
      c.push({
        label: groups?.secondLevel,
        path: `/${groups?.firstLevel}/${groups?.firstLevelId}/${groups?.secondLevel}`,
      });
    }

    if (groups?.secondLevelId) {
      c.push({
        label: groups?.secondLevelId,
        path: `/${groups?.firstLevel}/${groups?.firstLevelId}/${groups?.secondLevel}/${groups?.secondLevelId}`,
      });
    }

    if (groups?.secondLevelAction) {
      c.push({
        label: groups?.secondLevelAction,
        path: `/${groups?.firstLevel}/${groups?.firstLevelId}/${groups?.secondLevel}/${groups?.secondLevelAction}`,
      });
    }

    if (groups?.thirdLevel) {
      c.push({
        label: groups?.thirdLevel,
        path: `/${groups?.firstLevel}/${groups?.firstLevelId}/${groups?.secondLevel}/${groups?.secondLevelId}/${groups?.thirdLevel}`,
      });
    }

    if (groups?.thirdLevelId) {
      c.push({
        label: groups?.thirdLevelId,
        path: `/${groups?.firstLevel}/${groups?.firstLevelId}/${groups?.secondLevel}/${groups?.secondLevelId}/${groups?.thirdLevel}/${groups?.thirdLevelId}`,
      });
    }

    if (groups?.thirdLevelAction) {
      c.push({
        label: groups?.thirdLevelAction,
        path: `/${groups?.firstLevel}/${groups?.firstLevelId}/${groups?.secondLevel}/${groups?.secondLevelId}/${groups?.thirdLevel}/${groups?.thirdLevelAction}`,
      });
    }

    setCrumbs(c);
  }, [pathname]);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb mt-3 ms-3">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <React.Fragment key={idx}>
              <li className="breadcrumb-item">
                {crumb?.path ? (
                  <Link to={crumb?.path}>{crumb?.label}</Link>
                ) : (
                  <span>{crumb?.label}</span>
                )}
              </li>
              {!isLast && <span className="breadcrumb-separator"> &gt; </span>}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
