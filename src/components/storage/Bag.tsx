export default function Bag({ id, label, color }:{ id:string; label:string; color:string }) {
  return (
    <div className="badge" draggable
         onDragStart={(e) => e.dataTransfer.setData('text/plain', id)}
         style={{ background: color }} title={label}>
      {label}
    </div>
  )
}
