const Tabs = ({ tabs = [], activeKey, onChange }) => {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.key === activeKey)
  );
  const count = tabs.length || 1;
  const indicatorStyle = {
    transform: `translateX(${activeIndex * (100 / count)}%)`,
    width: `${100 / count}%`,
  };
  const listStyle = { '--tabs-count': count };

  return (
    <div className="tabs">
      <div className="tabs-list" role="tablist" style={listStyle}>
        <span className="tab-indicator" style={indicatorStyle} aria-hidden />
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className="tab"
            role="tab"
            aria-selected={tab.key === activeKey}
            onClick={() => onChange?.(tab.key)}
          >
            <span>{tab.label}</span>
            {tab.badge != null && <span className="tab-badge">{tab.badge}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
