function PageContainer({ children }) {
    return (
        <div className="max-w-5xl mx-auto px-gap-md mb-gap-md">
            {children}
        </div>
    );
}

export default PageContainer;