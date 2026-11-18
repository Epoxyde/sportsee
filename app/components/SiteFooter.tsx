import { SportSeeLogo } from "./SportSeeLogo";

export function SiteFooter() {
  return (
    <footer className="sportsee-footer">
      <div className="sportsee-footer-content">
        <p className="flex flex-wrap gap-x-[9px]">
          <span>©Sportsee</span>
          <span>Tous droits réservés</span>
        </p>
        <div className="flex items-center gap-4">
          {/* La maquette ne fournit pas de destination pour ces mentions. */}
          <span>Conditions générales</span>
          <span>Contact</span>
          <span className="ml-4 inline-flex"><SportSeeLogo markOnly /></span>
        </div>
      </div>
    </footer>
  );
}
