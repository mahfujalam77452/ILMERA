import React from "react";

const PageHeader = ({ title, subtitle = "", actions = null }) => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="section-title">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
};

export default PageHeader;
