import { connect } from 'react-redux';
import { homeSelector } from './selectors';
import { Home } from './Home';

export const HomeContainer = connect(homeSelector)(Home);