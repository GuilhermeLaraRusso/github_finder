import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RepoProps } from "../types/repo";
import Loader from "../components/Loader";
import BackBtn from "../components/BackBtn";
import Repo from "../components/Repo";

import classes from "./Repos.module.css";

const Repos = () => {
  const { username } = useParams();	
  const [isLoading, setIsLoading] = useState(true);
  const [repos, setRepos] = useState<RepoProps[] | [] | null>(null);

  useEffect(() => {
    const loadRepos = async (username: string) => {
      setIsLoading(true);

      const res = await fetch(`https://api.github.com/users/${username}/repos`);

      const data = await res.json();

      let orderedRepos = data.sort(
        (a: RepoProps, b: RepoProps) => b.stargazers_count - a.stargazers_count
      );

      orderedRepos = orderedRepos.slice(0, 5);

      setRepos(orderedRepos);
      console.log(orderedRepos);
  
      setIsLoading(false);
    }

    if (username) {
      loadRepos(username);
    }

  }, [username]);

  if (!repos && isLoading) return <Loader />;

  return (
    <div className={classes.repos}>
      <BackBtn />
      <h2>Explore os repositórios do usuário: {username}</h2>
      {repos && repos.length === 0 && <p>Não há repositórios</p>}
      {repos && repos.length > 0 && (
        <div className={classes.repos_container}>
          {repos.map((repo: RepoProps) => (
            <Repo key={repo.name} {...repo} />
          ))}
        </div>
      )}
    </div>
  )
};

export default Repos;