import { Link } from 'react-router-dom';

export default function ScreeningRow({ item, canEdit }) {
    return (
        <tr>
            <td className="fw-bold text-dark ps-4">
                {item.movieTitle}
            </td>
            <td>
                {new Date(item.startTime).toLocaleString()}
            </td>
            <td>
                {item.cinemaName}
            </td>
            <td className="pe-4">
                <div className="d-flex justify-content-center gap-2">
                    <Link to={`/screenings/details/${item.id}`} className="btn btn-sm btn-danger fw-bold shadow-sm px-3">
                        Details
                    </Link>

                    {canEdit && (
                        <Link to={`/screenings/delete/${item.id}`} className="btn btn-sm btn-dark fw-bold px-3">
                            Delete
                        </Link>
                    )}
                </div>
            </td>
        </tr>
    );
}