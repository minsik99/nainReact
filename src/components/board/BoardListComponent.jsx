import React from "react";


const BoardList = (props) => {
  return (
      <div>
        <h2 className="text-center">{props.title}</h2>
        <div className="row">
          <table className="table table-striped table-bordered">
            <thead>
            <tr>
              <th>{props.first}</th>
              <th>{props.second}</th>
              <th>{props.third}</th>
              <th>{props.fourth}</th>
            </tr>
            </thead>
          </table>
        </div>
      </div>
  );
}
export default BoardList;
