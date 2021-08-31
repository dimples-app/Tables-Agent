import { Redirect, Route, Switch } from "react-router-dom";
import NewTableForm from "./NewTableForm";
import ErrorAlert from "../layout/ErrorAlert";

function Tables(props) {
  const { handleNewTable, errors } = props;
  return (
    <div>
      <ErrorAlert errors={errors} />
      <Switch>
        <Route exact={true} path="/tables">
          <Redirect to="/dashboard" />
        </Route>
        <Route path="/tables/new">
          <NewTableForm handleNewTable={handleNewTable} />
        </Route>
      </Switch>
    </div>
  );
}

export default Tables;