import './App.css'

import { Provider } from 'react-redux';
import { store } from '../store/store';
import { Base } from '../features/base/base';
// import { SvgTest } from '../features/finger-board/svg-test';

function App() {

  return (
    <Provider store={store}>
      {/* <SvgTest /> */}
      <Base />
    </Provider>
  )
}

export default App
