import React from 'react';


const PagesList = ({children, childKey}) => {
 children = [].concat(children);
 return (
    <div className="pages">
        {children.filter(child => child.key === childKey)}
    </div>
)
}
export default PagesList;
