import { Provider } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import Home from "./screens/Home";
import { store } from './redux/store';

export default function App() {
    return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}
