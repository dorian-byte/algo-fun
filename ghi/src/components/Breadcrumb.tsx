import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { NAV_GET_PROBLEM_NAME_VIA_PROBLEM_ID } from '../graphql/navQueries';

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

  const { data: problemNameData, loading: problemNameLoading } = useQuery(
    NAV_GET_PROBLEM_NAME_VIA_PROBLEM_ID,
    {
      variables: {
        problemId: +groups?.firstLevelId,
      },
      skip: groups?.firstLevel !== 'problems' || !groups?.firstLevelId,
    }
  );

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    console.log('problemNameData', problemNameData);
  }, [problemNameData]);

  useEffect(() => {
    const c = [defaultCrumbs.home];

    if (groups?.firstLevel) {
      c.push(defaultCrumbs[groups?.firstLevel]);
    }

    if (groups?.firstLevelId) {
      let label = problemNameLoading
        ? 'Loading...'
        : problemNameData
        ? problemNameData?.problemById?.leetcodeNumber +
          '. ' +
          problemNameData?.problemById?.title
        : 'Submission Detail';
      c.push({
        label: label,
        path: `/${groups?.firstLevel}/${groups?.firstLevelId}`,
      });
    }

    if (groups?.firstLevelAction) {
      c.push({
        label: capitalizeFirstLetter(groups?.firstLevelAction),
        path: `/${groups?.firstLevel}/${groups?.firstLevelAction}`,
      });
    }

    if (groups?.secondLevel) {
      c.push({
        label: capitalizeFirstLetter(groups?.secondLevel),
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
        label: capitalizeFirstLetter(groups?.secondLevelAction),
        path: `/${groups?.firstLevel}/${groups?.firstLevelId}/${groups?.secondLevel}/${groups?.secondLevelAction}`,
      });
    }

    if (groups?.thirdLevel) {
      c.push({
        label: capitalizeFirstLetter(groups?.thirdLevel),
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
        label: capitalizeFirstLetter(groups?.thirdLevelAction),
        path: `/${groups?.firstLevel}/${groups?.firstLevelId}/${groups?.secondLevel}/${groups?.secondLevelId}/${groups?.thirdLevel}/${groups?.thirdLevelAction}`,
      });
    }

    setCrumbs(c);
  }, [pathname, problemNameData, problemNameLoading]);

  return (
    <div className="me-auto">
      <ol className="breadcrumb mt-3 ms-3">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <React.Fragment key={idx}>
              <li className="breadcrumb-item">
                {!isLast ? (
                  <Link to={crumb?.path as string}>{crumb?.label}</Link>
                ) : (
                  <span className="text-light">{crumb?.label}</span>
                )}
              </li>
              {!isLast && <span className="breadcrumb-separator"> &gt; </span>}
            </React.Fragment>
          );
        })}
      </ol>
    </div>
  );
};

export default Breadcrumb;
