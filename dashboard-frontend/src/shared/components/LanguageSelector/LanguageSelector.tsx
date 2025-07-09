import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styles from './LanguageSelector.module.scss';
import { useTranslation } from "react-i18next";

const AVAILABLE_LANGUAGES = [
    { value: "de", label: "Deutsch" },
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
];

const LanguageSelector = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (event: SelectChangeEvent) => {
        const lang = event.target.value as string;
        i18n.changeLanguage(lang);
    };

    return (
        <FormControl fullWidth className={styles.selectWrapper}>
            <InputLabel id="language-select-label">{t("language")}</InputLabel>
            <Select
                labelId="language-select-label"
                id="language-select"
                value={i18n.language}
                label="Language"
                onChange={changeLanguage}
            >
                {AVAILABLE_LANGUAGES.map((l) => (
                    <MenuItem key={l.value} value={l.value}>
                        {l.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default LanguageSelector;