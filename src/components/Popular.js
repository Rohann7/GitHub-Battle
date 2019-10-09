import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { fetchPopularRepos } from '../utils/api'
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa'
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip';


function LanguagesNav ({ selected, onUpdateLanguage}){
    const languages = ['All', 'JavaScript', 'Ruby', 'Python', 'Java', 'CSS']
    return(
        <div className="flex-center">
           {languages.map((language) =>(
               <li key={language}>
                  <button 
                     className="btn-clear nav-link"
                     style={language === selected ? {color: 'rgb(187, 46, 31)'} : null}
                     onClick={() => onUpdateLanguage(language)}> 
                     {language}
                  </button>
               </li>
           ))} 
        </div>
    );
}

LanguagesNav.propTypes = {
    selected: PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired
}

function ReposGrid({ repos }) {
    return(
        <ul className='grid space-around'>
           {repos.map((repo, index) => {
               const {name, owner, html_url, stargazers_count, forks, open_issues } = repo
               const { login, avatar_url } = owner

               return (
                   <li key={html_url}>
                     <Card
                         header={`#${index + 1}`}
                         avatar={avatar_url}
                         href={html_url}
                         name={login}
                       >
                        <ul className='card-list'>
                        <li>
                            <Tooltip text="GitHub Username">
                              <FaUser color='rgb(255, 191, 116)' size={22} />
                              <a href={`https://github.com/${login}`}>
                                 {login}
                              </a>
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip text="User's Stars">
                              <FaStar color='rgb(255, 215, 0)' size={22}/>
                              {stargazers_count.toLocaleString()} Stars
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip text="Forks">
                              <FaCodeBranch color='rgb(129, 195, 245)' size={22}/>
                              {forks.toLocaleString()} Forks
                            </Tooltip>
                        </li>
                        <li>
                            <Tooltip text="Open Issues">
                              <FaExclamationTriangle color='rgb(241, 138, 147)' size={22}/>
                              {open_issues.toLocaleString()} Open
                            </Tooltip>
                        </li>
                        </ul>
                     </Card>
                   </li>
               )
           })}
        </ul>
    );
}

ReposGrid.propTypes = {
    repos: PropTypes.array.isRequired,

}

class Popular extends Component {
    constructor(props){
        super(props);

        this.state={
            selectedLanguage: 'All',
            repos: {},
            error: null,
        };

        this.updateLanguage = this.updateLanguage.bind(this);
        this.isLoading = this.isLoading.bind(this);
    }
    componentDidMount(){
        this.updateLanguage(this.state.selectedLanguage)
    }


updateLanguage(selectedLanguage){
    this.setState({
        selectedLanguage,
        error: null,
    })
    if (!this.state.repos[selectedLanguage]) {
        fetchPopularRepos(selectedLanguage)
          .then((data) => {
            this.setState(({ repos }) => ({
              repos: {
                ...repos,
                [selectedLanguage]: data
              }
            }))
          })
          .catch(() => {
            console.warn('Error fetching repos: ')
  
            this.setState({
              error: `There was an error fetching the repositories.`
            })
          })
      }

}

isLoading(){

    const { selectedLanguage, error, repos } = this.state

    return !repos[selectedLanguage] && error === null

}
    render(){
        const { selectedLanguage, error, repos } = this.state

        return(
           <React.Fragment>
              <LanguagesNav 
                 selected = {selectedLanguage}
                  onUpdateLanguage = {this.updateLanguage}
               />
             {this.isLoading() && <Loading text='Fetching Repos' speed={300}/>}

             {error && <p className='center-text error'> {error}</p>}

             {repos[selectedLanguage] && <ReposGrid repos={repos[selectedLanguage]}/>}
           </React.Fragment>
        );

    }
}



export default Popular;