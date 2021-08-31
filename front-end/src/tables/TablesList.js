import React from 'react'

function TablesList(props) {
    const { tables, handleUnAssignTableToFinishReservation } = props;

    if (!tables) return null;
        const sortedTables = tables.sort((a, b) =>
        a.table_name.localeCompare(b.table_name)
    );

    return (
        <div>
        <h4 className="centertext">Tables</h4>
        <div className="row">
          {sortedTables.map((table) => (
            <div key={table.table_id} className="col-xs-12 col-sm-6 col-md-4">
              <div className="card mb-3">
                <div >
                  <p className="card-title">Table Name: {table.table_name}</p>
                  <p
                    className="card-body card-text"
                    data-table-id-status={table.table_id}
                  >
                    {!table.reservation_id ? "Free" : "Occupied"}
                  </p>
                  {table.reservation_id && (
                    <div className="justify-content-center pt-2">
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-table-id-finish={table.table_id}
                        onClick={() =>
                          handleUnAssignTableToFinishReservation(table.table_id)
                        }
                      >
                        Finish
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
    
      <hr />
    </div>
    )
}

export default TablesList