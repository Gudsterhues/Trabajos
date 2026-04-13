const TreeNode = ({ node }) => {
  if (!node) return null

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <div
        style={{
          display: 'inline-block',
          padding: '10px 15px',
          border: '1px solid black',
          borderRadius: '8px',
          backgroundColor: '#f2f2f2'
        }}
      >
        {node.value}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
        <TreeNode node={node.left} />
        <TreeNode node={node.right} />
      </div>
    </div>
  )
}

export default TreeNode