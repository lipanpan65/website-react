import * as React from "react";

const AppContent: React.FC = (props: any) => {

  return (
    <React.Fragment>
      <div>
        {props.children}
      </div>
    </React.Fragment>
  )
}

