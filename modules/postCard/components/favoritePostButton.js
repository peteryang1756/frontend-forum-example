import { useRouter } from 'next/router';
import React, { useState } from 'react';

import useUser from '@/common/hooks/useUser';
import httpRequest from '@/common/utils/httpRequest';
import { getCookie } from '@/common/utils/session';
import showToast from '@/common/utils/showToast';

const FavoritePostButtonComponent = ({ favorited, slug, totalFavorited }) => {
	const { user } = useUser();
	const router = useRouter();
	const [isFavorited, setFavorited] = useState(favorited);
	const [sumFavorited, setSumFavorited] = useState(totalFavorited);
	const [isLoading, setLoading] = useState(false);

	const onHandleClick = async (e) => {
		e.preventDefault();
		try {
			if (!user) {
				router.push('/login');
				return;
			}
			setLoading(true);
			const response = isFavorited
				? await httpRequest.delete({
						url: `/favorite_post`,
						params: {
							slug: slug
						},
						token: getCookie('token')
				  })
				: await httpRequest.post({
						url: `/favorite_post`,
						data: {
							slug: slug
						},
						token: getCookie('token')
				  });
			if (response.data.success) {
				setFavorited(!isFavorited);
				setSumFavorited(!isFavorited ? sumFavorited + 1 : sumFavorited - 1);
				showToast.success(`${!isFavorited ? 'Favorite' : 'Unfavorite'} ${response.data.data.slug} success`);
			}
		} catch (error) {
			console.log(error.response);
			showToast.error();
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{isLoading ? (
				<button
					className={`d-flex align-items-center border-0 bg-transparent ${
						isFavorited ? 'text-danger' : 'text-secondary'
					}`}
					disabled
				>
					{isFavorited ? (
						<>
							<i className="fa fa-heart fa-sm mr-1" />
						</>
					) : (
						<>
							<i className="fa fa-heart-o fa-sm mr-1" />
						</>
					)}
					<span className="mr-1">{sumFavorited}</span>
					<span className="d-none d-sm-block">likes</span>
					<div className="spinner-border spinner-border-sm text-info ml-1" role="status">
						<span className="sr-only">Loading...</span>
					</div>
				</button>
			) : (
				<button
					className={`d-flex align-items-center border-0 bg-transparent ${
						isFavorited ? 'text-danger' : 'text-secondary'
					}`}
					onClick={onHandleClick}
				>
					{isFavorited ? (
						<>
							<i className="fa fa-heart fa-sm mr-1" />
						</>
					) : (
						<>
							<i className="fa fa-heart-o fa-sm mr-1" />
						</>
					)}
					<span className="mr-1">{sumFavorited}</span>
					<span className="d-none d-sm-block">likes</span>
				</button>
			)}
		</>
	);
};

export default FavoritePostButtonComponent;
