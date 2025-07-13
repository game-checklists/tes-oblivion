import * as React from "react";
import {
  makeStyles,
  tokens,
  Text,
  Toolbar,
  Button,
  Drawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
  MenuList,
} from "@fluentui/react-components";
import {
  CheckmarkNoteRegular,
  NavigationRegular,
  Dismiss24Regular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "60px",
    position: "sticky",
    top: "0",
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: "10000",
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: 0,
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
  },
});

const questSections = [
  { title: "Main Story" },
  { title: "Fighters Guild" },
  { title: "Mages Guild" },
  { title: "Dark Brotherhood" },
  { title: "Thieves Guild" },
  { title: "Main City" },
  { title: "Non-journal Quests" },
  { title: "Master Training" },
  { title: "Arena" },
];

const locationSections = [
  { title: "Ayleid Ruins" },
  { title: "Campsites" },
  { title: "Daedric Shrines" },
  { title: "Caves & Entrances" },
  { title: "Forts" },
  { title: "Landmarks" },
  { title: "Settlements" },
];

const miscSections = [
  { title: "Oblivion Gates" },
  { title: "Skill Books" },
  { title: "Artifacts" },
  { title: "Horses" },
  { title: "Houses" },
];

const allSections = [
  { groupTitle: "Quests", sections: questSections },
  { groupTitle: "Locations Found", sections: locationSections },
  { groupTitle: "Miscellaneous", sections: miscSections },
];

// Helper to make anchor IDs
const makeId = (title: string) => title.replace(/\s+/g, "-").toLowerCase();

export const Header: React.FC = () => {
  const styles = useStyles();
  const [sidebarOutOfView, setSidebarOutOfView] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    const sidebar = document.querySelector("[data-sidebar]");
    if (!sidebar) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSidebarOutOfView(!entry.isIntersecting),
      { root: null, threshold: 0 }
    );

    observer.observe(sidebar);
    return () => observer.disconnect();
  }, []);

  const handleResetProgress = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("tes-oblivion-checklist-progress")) {
        localStorage.removeItem(key);
      }
    });
    window.location.reload();
  };

  const showMenuButton = sidebarOutOfView;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <CheckmarkNoteRegular fontSize="32" />
          <Text weight="semibold" size={400}>
            Oblivion checklist
          </Text>
        </div>
        <Toolbar className={styles.controls}>
          {showMenuButton && (
            <Button
              icon={<NavigationRegular />}
              aria-label="Open menu"
              onClick={() => setIsDrawerOpen(true)}
            />
          )}
          <Button appearance="secondary" onClick={handleResetProgress}>
            Reset
          </Button>
        </Toolbar>
      </header>

      <Drawer
        open={isDrawerOpen}
        position="end"
        onOpenChange={(_: any, data: any) => setIsDrawerOpen(data.open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={() => setIsDrawerOpen(false)}
              />
            }
          >
            Navigation
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          <nav onClick={() => setIsDrawerOpen(false)}>
            {allSections.map(({ groupTitle, sections }) => (
              <div key={groupTitle} style={{ marginBottom: "1rem" }}>
                <Text
                  weight="semibold"
                  block
                  style={{ marginBottom: "0.5rem" }}
                >
                  {groupTitle}
                </Text>
                <MenuList>
                  {sections.map(({ title }) => (
                    <a href={`#${makeId(title)}`} style={{ height: "32px" }}>
                      - {title}
                    </a>
                  ))}
                </MenuList>
              </div>
            ))}
          </nav>
        </DrawerBody>
      </Drawer>
    </>
  );
};
