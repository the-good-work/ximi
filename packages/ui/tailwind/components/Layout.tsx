const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className="fixed w-full h-full text-text bg-bg"
      style={{
        backgroundSize: "10px 10px",
        backgroundImage:
          "radial-gradient(circle, rgba(91, 70, 246, 0.57) 1px, rgba(0, 0, 0, 0) 1px)",
      }}
    >
      {children}
    </div>
  );
};

export { Layout };
