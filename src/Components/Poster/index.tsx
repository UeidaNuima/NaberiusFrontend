import * as React from 'react';
import { Radio } from 'antd';
import classNames from 'classnames';
import styles from './index.module.less';
import { GAME_POSTER_URL } from '../../consts';

interface PosterProps {
  posters: string[];
}

interface PosterStates {
  selectedPoster: string;
  selectedYear: string;
}

class Poster extends React.Component<PosterProps, PosterStates> {
  public state = {
    selectedPoster: '',
    selectedYear: '',
  };

  private years: string[] = [];

  public componentDidMount() {
    const { posters } = this.props;
    this.setState({
      selectedPoster: posters[posters.length - 1],
      selectedYear: posters[posters.length - 1].slice(0, 4),
    });
    posters.forEach(poster => {
      const year = poster.slice(0, 4);
      if (!this.years.find(y => y === year)) {
        this.years.push(year);
      }
    });
  }

  private handleYearChange = (e: any) => {
    this.setState({ selectedYear: e.target.value });
  };

  private handlePosterChange = (poster: string) => {
    this.setState({ selectedPoster: poster });
  };

  public render() {
    return (
      <div className={styles.container}>
        <Radio.Group
          onChange={this.handleYearChange}
          value={this.state.selectedYear}
        >
          {this.years.map(year => (
            <Radio.Button value={year} key={year}>
              {year}
            </Radio.Button>
          ))}
        </Radio.Group>
        <div className={styles.posterNameContainer}>
          {this.props.posters
            .filter(poster => poster.slice(0, 4) === this.state.selectedYear)
            .map(poster => (
              <span className={styles.posterBreadcrumb} key={poster}>
                <span
                  className={classNames(styles.posterBreadcrumbText, {
                    [styles.active]: this.state.selectedPoster === poster,
                  })}
                  onClick={() => this.handlePosterChange(poster)}
                >
                  {poster.slice(4)}
                </span>
                <span className={styles.posterBreadcrumbDivider}>/</span>
              </span>
            ))}
        </div>
        <img
          className={styles.poster}
          alt={this.state.selectedPoster}
          src={`${GAME_POSTER_URL}/event${this.state.selectedPoster}.jpg`}
        />
      </div>
    );
  }
}

export default Poster;
