function Home() {
  return (
    <div className="home-container">
      <form>
        <input type="text" style={{ flexGrow: 3 }} />
        <input type="text" style={{ flexGrow: 1 }} />
        <input type="text" style={{ flexGrow: 1 }} />
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
}

export default Home;
