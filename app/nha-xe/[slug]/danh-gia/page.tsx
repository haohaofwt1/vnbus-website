import OperatorReviewsPage, { generateMetadata as generateOperatorReviewsMetadata } from "@/app/operators/[slug]/reviews/page";

export const dynamic = "force-dynamic";

export const generateMetadata = generateOperatorReviewsMetadata;

export default OperatorReviewsPage;
